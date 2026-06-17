import { Task, Team } from "@prisma/client";
import { PaginationMeta } from "../../../common/types/api-response";

export const taskStatuses = ["PENDING", "IN_PROGRESS", "DONE"] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export type TaskWithTeams = Omit<Task, "status"> & {
  status: TaskStatus;
  teams: Team[];
};

export type TaskSort =
  | "createdAt:desc"
  | "createdAt:asc"
  | "dueDate:asc"
  | "dueDate:desc"
  | "title:asc"
  | "title:desc";

export interface ListTasksQuery {
  teamId?: string;
  status?: TaskStatus;
  search?: string;
  limit: number;
  offset: number;
  sort: TaskSort;
}

export interface ListTasksResult {
  tasks: TaskWithTeams[];
  meta: PaginationMeta;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
  teamIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
  teamIds?: string[];
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}
