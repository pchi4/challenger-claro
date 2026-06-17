import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE"
} as const;

async function main(): Promise<void> {
  await prisma.taskTeam.deleteMany();
  await prisma.task.deleteMany();
  await prisma.team.deleteMany();

  const mobileTeam = await prisma.team.create({
    data: {
      id: "team-mobile",
      name: "Mobile",
      colorHex: "#E30613",
      description: "Time responsável pela experiência no app mobile"
    }
  });

  const backendTeam = await prisma.team.create({
    data: {
      id: "team-backend",
      name: "Backend",
      colorHex: "#111827",
      description: "Time responsável pela API, dados e integrações"
    }
  });

  const productTeam = await prisma.team.create({
    data: {
      id: "team-produto",
      name: "Produto",
      colorHex: "#2563EB",
      description: "Time responsável por descoberta, priorização e métricas"
    }
  });

  await prisma.task.create({
    data: {
      id: "task-mapear-fluxo-times",
      title: "Mapear fluxo de gestão de times",
      description: "Definir como usuários criam, editam e removem times",
      status: TaskStatus.DONE,
      dueDate: new Date("2026-06-18T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: productTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-modelar-dados",
      title: "Modelar dados de tarefas e times",
      description: "Validar entidades, relacionamentos e regras de deleção",
      status: TaskStatus.DONE,
      dueDate: new Date("2026-06-19T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: backendTeam.id
          },
          {
            teamId: productTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-criar-api-times",
      title: "Criar API de times",
      description: "Implementar CRUD de times com validação e paginação",
      status: TaskStatus.DONE,
      dueDate: new Date("2026-06-20T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: backendTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-criar-api-tarefas",
      title: "Criar API de tarefas",
      description: "Implementar CRUD de tarefas e vínculo com times",
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date("2026-06-21T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: backendTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-desenhar-listagem-mobile",
      title: "Desenhar listagem mobile de tarefas",
      description: "Criar layout de filtros, cards e estados vazios",
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date("2026-06-22T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: mobileTeam.id
          },
          {
            teamId: productTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-implementar-filtros",
      title: "Implementar filtros de tarefas",
      description: "Adicionar busca por texto, status, time e ordenação",
      status: TaskStatus.IN_PROGRESS,
      dueDate: new Date("2026-06-23T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: backendTeam.id
          },
          {
            teamId: mobileTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-criar-empty-states",
      title: "Criar estados vazios",
      description: "Exibir mensagens quando não houver times ou tarefas",
      status: TaskStatus.PENDING,
      dueDate: new Date("2026-06-24T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: mobileTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-revisar-copy",
      title: "Revisar textos da interface",
      description: "Ajustar nomenclatura de times, tarefas, filtros e ações",
      status: TaskStatus.PENDING,
      dueDate: new Date("2026-06-25T00:00:00.000Z")
    }
  });

  await prisma.task.create({
    data: {
      id: "task-planejar-testes-e2e",
      title: "Planejar testes de integração",
      description: "Definir cenários principais para endpoints de times e tarefas",
      status: TaskStatus.PENDING,
      dueDate: new Date("2026-06-26T00:00:00.000Z"),
      teams: {
        create: [
          {
            teamId: backendTeam.id
          },
          {
            teamId: mobileTeam.id
          },
          {
            teamId: productTeam.id
          }
        ]
      }
    }
  });

  await prisma.task.create({
    data: {
      id: "task-preparar-demo",
      title: "Preparar roteiro de demo",
      description: "Criar massa e fluxo para demonstrar CRUD, filtros e vínculos",
      status: TaskStatus.PENDING,
      dueDate: new Date("2026-06-27T00:00:00.000Z")
    }
  });

  console.log("Seed completed with 3 teams and 10 tasks.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
