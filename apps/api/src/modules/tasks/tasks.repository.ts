import { Injectable } from "@nestjs/common";
import { Prisma, Task } from "@prisma/client";
import { PrismaService } from "@/modules/prisma/prisma.service";
import {
  CreateTaskInput,
  ListTasksQuery,
  TaskSort,
  TaskStatus,
  TaskWithTeams,
  UpdateTaskInput
} from "@/modules/tasks/types/task.types";

const taskWithTeamsInclude = {
  teams: {
    include: {
      team: true
    }
  }
} satisfies Prisma.TaskInclude;

type TaskWithTeamRelations = Prisma.TaskGetPayload<{
  include: typeof taskWithTeamsInclude;
}>;

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: ListTasksQuery): Promise<TaskWithTeams[]> {
    const tasks = await this.prisma.task.findMany({
      where: this.buildWhere(query),
      orderBy: this.buildOrderBy(query.sort),
      take: query.limit,
      skip: query.offset,
      include: taskWithTeamsInclude
    });

    return tasks.map((task) => this.mapTaskWithTeams(task));
  }

  async count(
    query: Pick<ListTasksQuery, "teamId" | "status" | "search">
  ): Promise<number> {
    return this.prisma.task.count({
      where: this.buildWhere(query)
    });
  }

  async findById(id: string): Promise<TaskWithTeams | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: taskWithTeamsInclude
    });

    return task === null ? null : this.mapTaskWithTeams(task);
  }

  async countTeamsByIds(teamIds: string[]): Promise<number> {
    return this.prisma.team.count({
      where: {
        id: {
          in: teamIds
        }
      }
    });
  }

  async create(data: CreateTaskInput): Promise<TaskWithTeams> {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        teams: this.buildTeamsCreate(data.teamIds)
      },
      include: taskWithTeamsInclude
    });

    return this.mapTaskWithTeams(task);
  }

  async update(id: string, data: UpdateTaskInput): Promise<TaskWithTeams> {
    const task = await this.prisma.$transaction(async (tx) => {
      if (data.teamIds !== undefined) {
        await tx.taskTeam.deleteMany({
          where: {
            taskId: id
          }
        });
      }

      return tx.task.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate,
          teams:
            data.teamIds === undefined
              ? undefined
              : this.buildTeamsCreate(data.teamIds)
        },
        include: taskWithTeamsInclude
      });
    });

    return this.mapTaskWithTeams(task);
  }

  async updateStatus(id: string, status: TaskStatus): Promise<TaskWithTeams> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        status
      },
      include: taskWithTeamsInclude
    });

    return this.mapTaskWithTeams(task);
  }

  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id }
    });
  }

  private buildTeamsCreate(
    teamIds?: string[]
  ): Prisma.TaskTeamCreateNestedManyWithoutTaskInput | undefined {
    if (teamIds === undefined) {
      return undefined;
    }

    return {
      create: teamIds.map((teamId) => ({
        team: {
          connect: {
            id: teamId
          }
        }
      }))
    };
  }

  private buildWhere(
    query: Pick<ListTasksQuery, "teamId" | "status" | "search">
  ): Prisma.TaskWhereInput | undefined {
    const filters: Prisma.TaskWhereInput[] = [];

    if (query.teamId !== undefined) {
      filters.push({
        teams: {
          some: {
            teamId: query.teamId
          }
        }
      });
    }

    if (query.status !== undefined) {
      filters.push({
        status: query.status
      });
    }

    if (query.search !== undefined) {
      filters.push({
        OR: [
          {
            title: {
              contains: query.search
            }
          },
          {
            description: {
              contains: query.search
            }
          }
        ]
      });
    }

    if (filters.length === 0) {
      return undefined;
    }

    return {
      AND: filters
    };
  }

  private buildOrderBy(sort: TaskSort): Prisma.TaskOrderByWithRelationInput {
    const [field, direction] = sort.split(":") as [
      "createdAt" | "dueDate" | "title",
      "asc" | "desc"
    ];

    return {
      [field]: direction
    };
  }

  private mapTaskWithTeams(task: TaskWithTeamRelations): TaskWithTeams {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      teams: task.teams.map((taskTeam) => taskTeam.team)
    };
  }
}
