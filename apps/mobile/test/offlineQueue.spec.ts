import {
  enqueueMutation,
  replacePendingReferences
} from "@/shared/offline/offlineQueue";
import { PendingMutation } from "@/shared/offline/offline.types";

type MockOfflineState = {
  idMappings: Record<string, string>;
  pendingMutations: PendingMutation[];
  tasks: unknown[];
  teams: unknown[];
};

let mockState: MockOfflineState;

jest.mock("@/shared/offline/offlineState", () => ({
  readOfflineState: jest.fn(() => mockState),
  writeOfflineState: jest.fn((updater: (state: MockOfflineState) => MockOfflineState) => {
    mockState = updater(mockState);
    return mockState;
  })
}));

describe("offlineQueue", () => {
  beforeEach(() => {
    mockState = {
      idMappings: {},
      pendingMutations: [],
      tasks: [],
      teams: []
    };
  });

  it("consolida alteração de status em uma task criada offline", () => {
    enqueueMutation({
      type: "createTask",
      clientId: "offline-task-1",
      payload: {
        title: "Criar tela",
        status: "PENDING",
        teamIds: ["offline-team-1"]
      }
    });

    enqueueMutation({
      type: "updateTaskStatus",
      id: "offline-task-1",
      status: "DONE"
    });

    expect(mockState.pendingMutations).toEqual([
      {
        type: "createTask",
        clientId: "offline-task-1",
        payload: {
          title: "Criar tela",
          status: "DONE",
          teamIds: ["offline-team-1"]
        }
      }
    ]);
  });

  it("remove um createTeam pendente quando o time e deletado antes do sync", () => {
    enqueueMutation({
      type: "createTeam",
      clientId: "offline-team-1",
      payload: {
        name: "Mobile",
        colorHex: "#E30613"
      }
    });

    enqueueMutation({
      type: "deleteTeam",
      id: "offline-team-1"
    });

    expect(mockState.pendingMutations).toEqual([]);
  });

  it("atualiza referencias pendentes quando um id offline e resolvido", () => {
    const queue: PendingMutation[] = [
      {
        type: "createTask",
        clientId: "offline-task-1",
        payload: {
          title: "Integrar API",
          teamIds: ["offline-team-1"]
        }
      },
      {
        type: "updateTask",
        id: "offline-task-1",
        payload: {
          teamIds: ["offline-team-1", "team-backend"]
        }
      }
    ];

    expect(
      replacePendingReferences(queue, "offline-team-1", "team-mobile")
    ).toEqual([
      {
        type: "createTask",
        clientId: "offline-task-1",
        payload: {
          title: "Integrar API",
          teamIds: ["team-mobile"]
        }
      },
      {
        type: "updateTask",
        id: "offline-task-1",
        payload: {
          teamIds: ["team-mobile", "team-backend"]
        }
      }
    ]);
  });
});
