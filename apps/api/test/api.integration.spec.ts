import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request = require("supertest");
import { AppModule } from "@/app.module";
import { setupApp } from "@/app.setup";
import { PrismaService } from "@/modules/prisma/prisma.service";

const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE"
} as const;

type TaskStatusValue = (typeof TaskStatus)[keyof typeof TaskStatus];

interface Team {
  id: string;
  name: string;
  colorHex: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatusValue;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskTeamRecord {
  taskId: string;
  teamId: string;
}

interface TaskResponse extends Omit<Task, "createdAt" | "updatedAt" | "dueDate"> {
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
  teams: TeamResponse[];
}

interface TeamResponse extends Omit<Team, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface CreateTeamArgs {
  data: {
    name: string;
    colorHex: string;
    description?: string;
  };
}

interface UpdateTeamArgs {
  where: {
    id: string;
  };
  data: Partial<Pick<Team, "name" | "colorHex" | "description">>;
}

interface TeamQueryArgs {
  where?: {
    OR?: Array<{
      name?: {
        contains: string;
      };
      description?: {
        contains: string;
      };
    }>;
  };
  take?: number;
  skip?: number;
}

interface TaskQueryArgs {
  where?: TaskWhereInput;
  take?: number;
  skip?: number;
  orderBy?: Partial<Record<"createdAt" | "dueDate" | "title", "asc" | "desc">>;
}

interface TaskWhereInput {
  AND?: TaskWhereInput[];
  OR?: Array<{
    title?: {
      contains: string;
    };
    description?: {
      contains: string;
    };
  }>;
  teams?: {
    some: {
      teamId: string;
    };
  };
  status?: TaskStatusValue;
}

interface CreateTaskArgs {
  data: {
    title: string;
    description?: string;
    status?: TaskStatusValue;
    dueDate?: Date;
    teams?: TaskTeamsCreateInput;
  };
}

interface UpdateTaskArgs {
  where: {
    id: string;
  };
  data: Partial<Pick<Task, "title" | "description" | "status" | "dueDate">> & {
    teams?: TaskTeamsCreateInput;
  };
}

interface TaskTeamsCreateInput {
  create: Array<{
    team?: {
      connect: {
        id: string;
      };
    };
    teamId?: string;
  }>;
}

interface DeleteArgs {
  where: {
    id: string;
  };
}

interface DeleteTaskTeamsArgs {
  where: {
    taskId: string;
  };
}

interface CountTeamsArgs {
  where?: {
    id?: {
      in: string[];
    };
  };
}

class InMemoryPrismaService {
  private teams: Team[] = [];
  private tasks: Task[] = [];
  private taskTeams: TaskTeamRecord[] = [];
  private teamSequence = 1;
  private taskSequence = 1;

  readonly team = {
    findMany: (args: TeamQueryArgs): Team[] =>
      this.findTeams(args).slice(args.skip ?? 0, (args.skip ?? 0) + (args.take ?? 20)),
    count: (args: TeamQueryArgs | CountTeamsArgs): number => {
      if (this.isCountTeamsArgs(args)) {
        return this.teams.filter((team) => args.where?.id?.in.includes(team.id)).length;
      }

      return this.findTeams(args).length;
    },
    findUnique: (args: DeleteArgs): Team | null =>
      this.teams.find((team) => team.id === args.where.id) ?? null,
    create: (args: CreateTeamArgs): Team => {
      const now = new Date();
      const team = {
        id: `team-${this.teamSequence}`,
        name: args.data.name,
        colorHex: args.data.colorHex,
        description: args.data.description ?? null,
        createdAt: now,
        updatedAt: now
      };

      this.teamSequence += 1;
      this.teams.push(team);

      return team;
    },
    update: (args: UpdateTeamArgs): Team => {
      const team = this.requireTeam(args.where.id);
      Object.assign(team, args.data, { updatedAt: new Date() });

      return team;
    },
    delete: (args: DeleteArgs): Team => {
      const team = this.requireTeam(args.where.id);
      this.teams = this.teams.filter((item) => item.id !== args.where.id);
      this.taskTeams = this.taskTeams.filter((item) => item.teamId !== args.where.id);

      return team;
    }
  };

  readonly task = {
    findMany: (args: TaskQueryArgs): Array<Task & { teams: Array<{ team: Team }> }> => {
      const tasks = this.sortTasks(this.findTasks(args.where), args.orderBy);
      return tasks
        .slice(args.skip ?? 0, (args.skip ?? 0) + (args.take ?? 10))
        .map((task) => this.includeTeams(task));
    },
    count: (args: Pick<TaskQueryArgs, "where">): number =>
      this.findTasks(args.where).length,
    findUnique: (args: DeleteArgs): (Task & { teams: Array<{ team: Team }> }) | null => {
      const task = this.tasks.find((item) => item.id === args.where.id);
      return task === undefined ? null : this.includeTeams(task);
    },
    create: (args: CreateTaskArgs): Task & { teams: Array<{ team: Team }> } => {
      const now = new Date();
      const task = {
        id: `task-${this.taskSequence}`,
        title: args.data.title,
        description: args.data.description ?? null,
        status: args.data.status ?? TaskStatus.PENDING,
        dueDate: args.data.dueDate ?? null,
        createdAt: now,
        updatedAt: now
      };

      this.taskSequence += 1;
      this.tasks.push(task);
      this.createTaskTeams(task.id, args.data.teams);

      return this.includeTeams(task);
    },
    update: (args: UpdateTaskArgs): Task & { teams: Array<{ team: Team }> } => {
      const task = this.requireTask(args.where.id);
      Object.assign(task, args.data, { teams: undefined, updatedAt: new Date() });
      this.createTaskTeams(task.id, args.data.teams);

      return this.includeTeams(task);
    },
    delete: (args: DeleteArgs): Task => {
      const task = this.requireTask(args.where.id);
      this.tasks = this.tasks.filter((item) => item.id !== args.where.id);
      this.taskTeams = this.taskTeams.filter((item) => item.taskId !== args.where.id);

      return task;
    }
  };

  readonly taskTeam = {
    deleteMany: (args: DeleteTaskTeamsArgs): { count: number } => {
      const before = this.taskTeams.length;
      this.taskTeams = this.taskTeams.filter(
        (taskTeam) => taskTeam.taskId !== args.where.taskId
      );

      return { count: before - this.taskTeams.length };
    }
  };

  async $transaction<T>(
    callback: (tx: Pick<InMemoryPrismaService, "task" | "taskTeam">) => T | Promise<T>
  ): Promise<T> {
    return callback({
      task: this.task,
      taskTeam: this.taskTeam
    });
  }

  async healthcheck(): Promise<void> {
    return Promise.resolve();
  }

  private findTeams(args: TeamQueryArgs): Team[] {
    const search = args.where?.OR?.[0]?.name?.contains;

    if (search === undefined) {
      return [...this.teams];
    }

    return this.teams.filter(
      (team) =>
        team.name.includes(search) || (team.description?.includes(search) ?? false)
    );
  }

  private findTasks(where?: TaskWhereInput): Task[] {
    if (where === undefined) {
      return [...this.tasks];
    }

    if (where.AND !== undefined) {
      return this.tasks.filter((task) =>
        where.AND?.every((filter) => this.matchesTaskWhere(task, filter)) ?? true
      );
    }

    return this.tasks.filter((task) => this.matchesTaskWhere(task, where));
  }

  private matchesTaskWhere(task: Task, where: TaskWhereInput): boolean {
    if (where.status !== undefined && task.status !== where.status) {
      return false;
    }

    if (
      where.teams !== undefined &&
      !this.taskTeams.some(
        (taskTeam) =>
          taskTeam.taskId === task.id &&
          taskTeam.teamId === where.teams?.some.teamId
      )
    ) {
      return false;
    }

    if (where.OR !== undefined) {
      return where.OR.some((filter) => {
        const titleSearch = filter.title?.contains;
        const descriptionSearch = filter.description?.contains;

        return (
          (titleSearch !== undefined && task.title.includes(titleSearch)) ||
          (descriptionSearch !== undefined &&
            (task.description?.includes(descriptionSearch) ?? false))
        );
      });
    }

    return true;
  }

  private sortTasks(
    tasks: Task[],
    orderBy?: Partial<Record<"createdAt" | "dueDate" | "title", "asc" | "desc">>
  ): Task[] {
    const [field, direction] = Object.entries(orderBy ?? { createdAt: "desc" })[0] as [
      "createdAt" | "dueDate" | "title",
      "asc" | "desc"
    ];

    return [...tasks].sort((left, right) => {
      const leftValue = left[field];
      const rightValue = right[field];
      const comparison = String(leftValue ?? "").localeCompare(String(rightValue ?? ""));

      return direction === "asc" ? comparison : -comparison;
    });
  }

  private createTaskTeams(taskId: string, input?: TaskTeamsCreateInput): void {
    input?.create.forEach((item) => {
      const teamId = item.teamId ?? item.team?.connect.id;

      if (teamId !== undefined) {
        this.taskTeams.push({ taskId, teamId });
      }
    });
  }

  private includeTeams(task: Task): Task & { teams: Array<{ team: Team }> } {
    return {
      ...task,
      teams: this.taskTeams
        .filter((taskTeam) => taskTeam.taskId === task.id)
        .map((taskTeam) => ({
          team: this.requireTeam(taskTeam.teamId)
        }))
    };
  }

  private requireTeam(id: string): Team {
    const team = this.teams.find((item) => item.id === id);

    if (team === undefined) {
      throw new Error(`Team ${id} not found`);
    }

    return team;
  }

  private requireTask(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (task === undefined) {
      throw new Error(`Task ${id} not found`);
    }

    return task;
  }

  private isCountTeamsArgs(args: TeamQueryArgs | CountTeamsArgs): args is CountTeamsArgs {
    return "where" in args && "id" in (args.where ?? {});
  }
}

describe("API integration", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(PrismaService)
      .useValue(new InMemoryPrismaService())
      .compile();

    app = moduleRef.createNestApplication();
    setupApp(app);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("Teams", () => {
    it("deve criar um time", async () => {
      const response = await api(app)
        .post("/api/teams")
        .send({
          name: "Mobile Team",
          colorHex: "#E30613",
          description: "Time responsável pelo app"
        })
        .expect(201);

      const body = response.body as ApiResponse<TeamResponse>;

      expect(body.data.name).toBe("Mobile Team");
      expect(body.data.colorHex).toBe("#E30613");
      expect(response.headers["x-request-id"]).toEqual(expect.any(String));
    });

    it("deve listar times com meta", async () => {
      await createTeam(app, "Mobile", "#E30613");
      await createTeam(app, "Backend", "#111827");

      const response = await api(app)
        .get("/api/teams")
        .query({ limit: 1, offset: 0 })
        .expect(200);

      const body = response.body as ApiResponse<TeamResponse[]>;

      expect(body.data).toHaveLength(1);
      expect(body.meta).toEqual({
        total: 2,
        limit: 1,
        offset: 0
      });
    });

    it("deve buscar time por id", async () => {
      const created = await createTeam(app, "Produto", "#2563EB");

      const response = await api(app)
        .get(`/api/teams/${created.id}`)
        .expect(200);

      const body = response.body as ApiResponse<TeamResponse>;

      expect(body.data.id).toBe(created.id);
      expect(body.data.name).toBe("Produto");
    });

    it("deve validar colorHex inválido", async () => {
      const response = await api(app)
        .post("/api/teams")
        .send({
          name: "Design",
          colorHex: "red"
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed"
        }
      });
    });

    it("deve deletar um time", async () => {
      const created = await createTeam(app, "Backend", "#111827");

      await api(app)
        .delete(`/api/teams/${created.id}`)
        .expect(200);

      await api(app).get(`/api/teams/${created.id}`).expect(404);
    });
  });

  describe("Observability", () => {
    it("deve retornar healthcheck com status ok", async () => {
      const response = await api(app).get("/api/health").expect(200);

      expect(response.body).toMatchObject({
        data: {
          status: "ok",
          database: {
            status: "ok"
          }
        }
      });
    });

    it("deve retornar metricas com contadores de requests", async () => {
      await api(app).get("/api/health").expect(200);
      const response = await api(app).get("/api/metrics").expect(200);

      expect(response.body.data.totals.requests).toBeGreaterThanOrEqual(1);
      expect(response.body.data.routes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            method: "GET",
            path: "/api/health",
            statusCode: 200
          })
        ])
      );
    });
  });

  describe("Tasks", () => {
    it("deve criar task sem time", async () => {
      const created = await createTask(app, {
        title: "Criar tela de tarefas",
        status: TaskStatus.PENDING
      });

      expect(created.title).toBe("Criar tela de tarefas");
      expect(created.teams).toEqual([]);
    });

    it("deve criar task com múltiplos times", async () => {
      const mobile = await createTeam(app, "Mobile", "#E30613");
      const backend = await createTeam(app, "Backend", "#111827");

      const task = await createTask(app, {
        title: "Integrar app com API",
        status: TaskStatus.IN_PROGRESS,
        teamIds: [mobile.id, backend.id]
      });

      expect(task.teams.map((team) => team.id).sort()).toEqual(
        [backend.id, mobile.id].sort()
      );
    });

    it("deve listar tasks com meta", async () => {
      await createTask(app, { title: "Criar filtros", status: TaskStatus.PENDING });
      await createTask(app, { title: "Criar listagem", status: TaskStatus.DONE });

      const response = await api(app)
        .get("/api/tasks")
        .query({ limit: 1, offset: 0 })
        .expect(200);

      const body = response.body as ApiResponse<TaskResponse[]>;

      expect(body.data).toHaveLength(1);
      expect(body.meta).toEqual({
        total: 2,
        limit: 1,
        offset: 0
      });
    });

    it("deve filtrar tasks por status", async () => {
      await createTask(app, { title: "Ajustar payload", status: TaskStatus.PENDING });
      await createTask(app, { title: "Publicar build", status: TaskStatus.DONE });

      const response = await api(app)
        .get("/api/tasks")
        .query({ status: TaskStatus.DONE })
        .expect(200);

      const body = response.body as ApiResponse<TaskResponse[]>;

      expect(body.data).toHaveLength(1);
      expect(body.data[0]?.status).toBe(TaskStatus.DONE);
    });

    it("deve filtrar tasks por teamId", async () => {
      const mobile = await createTeam(app, "Mobile", "#E30613");
      const backend = await createTeam(app, "Backend", "#111827");
      await createTask(app, {
        title: "Criar UI mobile",
        status: TaskStatus.PENDING,
        teamIds: [mobile.id]
      });
      await createTask(app, {
        title: "Criar endpoint",
        status: TaskStatus.PENDING,
        teamIds: [backend.id]
      });

      const response = await api(app)
        .get("/api/tasks")
        .query({ teamId: mobile.id })
        .expect(200);

      const body = response.body as ApiResponse<TaskResponse[]>;

      expect(body.data).toHaveLength(1);
      expect(body.data[0]?.teams[0]?.id).toBe(mobile.id);
    });

    it("deve buscar por search", async () => {
      await createTask(app, {
        title: "Configurar métricas",
        description: "Adicionar eventos do funil",
        status: TaskStatus.PENDING
      });
      await createTask(app, {
        title: "Criar API",
        description: "Implementar endpoints REST",
        status: TaskStatus.PENDING
      });

      const response = await api(app)
        .get("/api/tasks")
        .query({ search: "métricas" })
        .expect(200);

      const body = response.body as ApiResponse<TaskResponse[]>;

      expect(body.data).toHaveLength(1);
      expect(body.data[0]?.title).toBe("Configurar métricas");
    });

    it("deve alterar status via PATCH", async () => {
      const task = await createTask(app, {
        title: "Finalizar documentação",
        status: TaskStatus.PENDING
      });

      const response = await api(app)
        .patch(`/api/tasks/${task.id}/status`)
        .send({ status: TaskStatus.DONE })
        .expect(200);

      const body = response.body as ApiResponse<TaskResponse>;

      expect(body.data.status).toBe(TaskStatus.DONE);
    });

    it("deve deletar task", async () => {
      const task = await createTask(app, {
        title: "Remover item antigo",
        status: TaskStatus.PENDING
      });

      await api(app).delete(`/api/tasks/${task.id}`).expect(200);
      await api(app).get(`/api/tasks/${task.id}`).expect(404);
    });
  });
});

async function createTeam(
  app: INestApplication,
  name: string,
  colorHex: string
): Promise<TeamResponse> {
  const response = await api(app).post("/api/teams").send({
    name,
    colorHex,
    description: `${name} description`
  });
  const body = response.body as ApiResponse<TeamResponse>;

  return body.data;
}

async function createTask(
  app: INestApplication,
  body: {
    title: string;
    description?: string;
    status: TaskStatusValue;
    teamIds?: string[];
  }
): Promise<TaskResponse> {
  const response = await api(app)
    .post("/api/tasks")
    .send({
      description: "Descrição da tarefa",
      dueDate: "2026-06-20T00:00:00.000Z",
      ...body
    });
  const responseBody = response.body as ApiResponse<TaskResponse>;

  return responseBody.data;
}

function api(app: INestApplication): request.SuperTest<request.Test> {
  return request(app.getHttpServer());
}
