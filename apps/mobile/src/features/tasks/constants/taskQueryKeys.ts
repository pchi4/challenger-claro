import { GetTasksParams } from "../types/task.types";

export const taskQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskQueryKeys.all, "list"] as const,
  list: (params: GetTasksParams = {}) =>
    [...taskQueryKeys.lists(), params] as const,
  details: () => [...taskQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...taskQueryKeys.details(), id] as const
};
