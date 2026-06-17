import { Team } from "../../teams/types/team.types";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  teams: Team[];
}

export type TaskSort =
  | "createdAt:desc"
  | "createdAt:asc"
  | "dueDate:asc"
  | "dueDate:desc"
  | "title:asc"
  | "title:desc";

export interface GetTasksParams
  extends Record<string, string | number | boolean | undefined> {
  teamId?: string;
  status?: TaskStatus;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: TaskSort;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  teamIds?: string[];
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}
