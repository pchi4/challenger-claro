import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { Task } from "@/features/tasks/types/task.types";
import {
  getInitialTaskDetail,
  getTaskByIdWithOffline
} from "@/shared/offline/offlineApi";

export function useTask(id: string): UseQueryResult<ApiResponse<Task>, Error> {
  return useQuery({
    queryKey: taskQueryKeys.detail(id),
    queryFn: () => getTaskByIdWithOffline(id),
    initialData: getInitialTaskDetail(id),
    enabled: id.length > 0
  });
}
