import {
  buildTasksResponse,
  buildTeamsResponse,
  mergeTasks,
  mergeTeams
} from "@/shared/offline/offlineUtils";

describe("offlineUtils", () => {
  it("filtra tasks por teamId mapeado, status e busca com ordenacao e paginacao", () => {
    const tasks = [
      {
        id: "task-1",
        title: "Criar dashboard",
        description: "Ajustar metricas",
        status: "DONE" as const,
        dueDate: "2026-07-02T00:00:00.000Z",
        createdAt: "2026-06-28T00:00:00.000Z",
        updatedAt: "2026-06-28T00:00:00.000Z",
        teams: [
          {
            id: "team-mobile",
            name: "Mobile",
            colorHex: "#E30613",
            description: null,
            createdAt: "2026-06-28T00:00:00.000Z",
            updatedAt: "2026-06-28T00:00:00.000Z"
          }
        ]
      },
      {
        id: "task-2",
        title: "Criar dashboard executivo",
        description: "Consolidar metricas",
        status: "DONE" as const,
        dueDate: "2026-07-01T00:00:00.000Z",
        createdAt: "2026-06-27T00:00:00.000Z",
        updatedAt: "2026-06-27T00:00:00.000Z",
        teams: [
          {
            id: "team-mobile",
            name: "Mobile",
            colorHex: "#E30613",
            description: null,
            createdAt: "2026-06-27T00:00:00.000Z",
            updatedAt: "2026-06-27T00:00:00.000Z"
          }
        ]
      },
      {
        id: "task-3",
        title: "Criar endpoint",
        description: "Publicar API",
        status: "PENDING" as const,
        dueDate: "2026-07-03T00:00:00.000Z",
        createdAt: "2026-06-29T00:00:00.000Z",
        updatedAt: "2026-06-29T00:00:00.000Z",
        teams: [
          {
            id: "team-backend",
            name: "Backend",
            colorHex: "#111827",
            description: null,
            createdAt: "2026-06-29T00:00:00.000Z",
            updatedAt: "2026-06-29T00:00:00.000Z"
          }
        ]
      }
    ];

    const response = buildTasksResponse(
      tasks,
      {
        "offline-team-1": "team-mobile"
      },
      {
        teamId: "offline-team-1",
        status: "DONE",
        search: "dashboard",
        sort: "dueDate:asc",
        limit: 1,
        offset: 0
      }
    );

    expect(response.data.map((task) => task.id)).toEqual(["task-2"]);
    expect(response.meta).toEqual({
      total: 2,
      limit: 1,
      offset: 0
    });
  });

  it("filtra teams por busca e preserva merge por id", () => {
    const teams = [
      {
        id: "team-mobile",
        name: "Mobile",
        colorHex: "#E30613",
        description: "App",
        createdAt: "2026-06-28T00:00:00.000Z",
        updatedAt: "2026-06-28T00:00:00.000Z"
      },
      {
        id: "team-backend",
        name: "Backend",
        colorHex: "#111827",
        description: "API",
        createdAt: "2026-06-29T00:00:00.000Z",
        updatedAt: "2026-06-29T00:00:00.000Z"
      }
    ];

    expect(
      buildTeamsResponse(teams, {
        search: "api",
        limit: 10,
        offset: 0
      }).data.map((team) => team.id)
    ).toEqual(["team-backend"]);

    expect(
      mergeTeams(teams, [
        {
          ...teams[0],
          name: "Mobile Platform"
        }
      ]).find((team) => team.id === "team-mobile")?.name
    ).toBe("Mobile Platform");

    expect(
      mergeTasks(
        [
          {
            id: "task-1",
            title: "Criar dashboard",
            description: null,
            status: "PENDING",
            dueDate: null,
            createdAt: "2026-06-28T00:00:00.000Z",
            updatedAt: "2026-06-28T00:00:00.000Z",
            teams: []
          }
        ],
        [
          {
            id: "task-1",
            title: "Criar dashboard v2",
            description: null,
            status: "DONE",
            dueDate: null,
            createdAt: "2026-06-28T00:00:00.000Z",
            updatedAt: "2026-06-30T00:00:00.000Z",
            teams: []
          }
        ]
      )[0]?.title
    ).toBe("Criar dashboard v2");
  });
});
