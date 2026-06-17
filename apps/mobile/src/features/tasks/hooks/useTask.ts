import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { getTaskById } from "../api/tasksApi";
import { taskQueryKeys } from "../constants/taskQueryKeys";
import { Task } from "../types/task.types";

export function useTask(id: string): UseQueryResult<ApiResponse<Task>, Error> {
  return useQuery({
    queryKey: taskQueryKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: id.length > 0
  });
}
