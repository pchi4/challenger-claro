import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { CreateTaskPayload, Task } from "@/features/tasks/types/task.types";
import { createTaskWithOffline } from "@/shared/offline/offlineApi";

export function useCreateTask(): UseMutationResult<
  ApiResponse<Task>,
  Error,
  CreateTaskPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskWithOffline,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists()
      });
    }
  });
}
