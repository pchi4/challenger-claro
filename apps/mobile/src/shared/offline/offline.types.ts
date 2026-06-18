import { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from "@/features/tasks/types/task.types";
import { CreateTeamPayload, Team, UpdateTeamPayload } from "@/features/teams/types/team.types";

export interface OfflineState {
  idMappings: Record<string, string>;
  pendingMutations: PendingMutation[];
  tasks: Task[];
  teams: Team[];
}

export type PendingMutation =
  | {
      type: "createTeam";
      clientId: string;
      payload: CreateTeamPayload;
    }
  | {
      type: "updateTeam";
      id: string;
      payload: UpdateTeamPayload;
    }
  | {
      type: "deleteTeam";
      id: string;
    }
  | {
      type: "createTask";
      clientId: string;
      payload: CreateTaskPayload;
    }
  | {
      type: "updateTask";
      id: string;
      payload: UpdateTaskPayload;
    }
  | {
      type: "deleteTask";
      id: string;
    }
  | {
      type: "updateTaskStatus";
      id: string;
      status: TaskStatus;
    };

export const defaultOfflineState: OfflineState = {
  idMappings: {},
  pendingMutations: [],
  tasks: [],
  teams: []
};
