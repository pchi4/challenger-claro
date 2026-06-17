import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { getTasks } from "../api/tasksApi";
import { taskQueryKeys } from "../constants/taskQueryKeys";
import { GetTasksParams, Task } from "../types/task.types";

export function useTasks(
  params: GetTasksParams = {}
): UseQueryResult<ApiResponse<Task[]>, Error> {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => getTasks(params)
  });
}
