import { updateOfflineTaskStatus } from "@/shared/offline/offlineMutations";
import { PendingMutation } from "@/shared/offline/offline.types";

type MockOfflineState = {
  idMappings: Record<string, string>;
  pendingMutations: PendingMutation[];
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    teams: Array<{
      id: string;
      name: string;
      colorHex: string;
      description: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
  teams: Array<{
    id: string;
    name: string;
    colorHex: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
};

let mockState: MockOfflineState;

jest.mock("@/shared/offline/offlineState", () => ({
  readOfflineState: jest.fn(() => mockState),
  writeOfflineState: jest.fn((updater: (state: MockOfflineState) => MockOfflineState) => {
    mockState = updater(mockState);
    return mockState;
  })
}));

jest.mock("@/shared/offline/offlineCache", () => ({
  removeTaskFromStorage: jest.fn(),
  removeTeamFromStorage: jest.fn(),
  saveTask: jest.fn(),
  saveTeam: jest.fn()
}));

describe("offlineMutations", () => {
  beforeEach(() => {
    const now = "2026-06-30T00:00:00.000Z";

    mockState = {
      idMappings: {},
      pendingMutations: [],
      teams: [
        {
          id: "team-mobile",
          name: "Mobile",
          colorHex: "#E30613",
          description: null,
          createdAt: now,
          updatedAt: now
        }
      ],
      tasks: [
        {
          id: "task-1",
          title: "Criar tela",
          description: null,
          status: "PENDING",
          dueDate: null,
          createdAt: now,
          updatedAt: now,
          teams: [
            {
              id: "team-mobile",
              name: "Mobile",
              colorHex: "#E30613",
              description: null,
              createdAt: now,
              updatedAt: now
            }
          ]
        }
      ]
    };
  });

  it("atualiza o status localmente e enfileira apenas a mutacao de status", () => {
    const response = updateOfflineTaskStatus("task-1", "DONE");

    expect(response?.data.status).toBe("DONE");
    expect(mockState.tasks[0]?.status).toBe("DONE");
    expect(mockState.pendingMutations).toEqual([
      {
        type: "updateTaskStatus",
        id: "task-1",
        status: "DONE"
      }
    ]);
  });

  it("retorna undefined quando a task nao existe no cache offline", () => {
    const response = updateOfflineTaskStatus("task-inexistente", "DONE");

    expect(response).toBeUndefined();
    expect(mockState.pendingMutations).toEqual([]);
  });
});
