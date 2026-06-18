import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { GetTasksParams, Task } from "@/features/tasks/types/task.types";
import {
  getInitialTasksResponse,
  getTasksWithOffline
} from "@/shared/offline/offlineApi";

interface UseTasksOptions {
  enabled?: boolean;
}

export function useTasks(
  params: GetTasksParams = {},
  options: UseTasksOptions = {}
): UseQueryResult<ApiResponse<Task[]>, Error> {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => getTasksWithOffline(params),
    initialData: getInitialTasksResponse(params),
    enabled: options.enabled ?? true
  });
}
