import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { Task, UpdateTaskPayload } from "@/features/tasks/types/task.types";
import { updateTaskWithOffline } from "@/shared/offline/offlineApi";

interface UpdateTaskVariables {
  id: string;
  payload: UpdateTaskPayload;
}

export function useUpdateTask(): UseMutationResult<
  ApiResponse<Task>,
  Error,
  UpdateTaskVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateTaskWithOffline(id, payload),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(taskQueryKeys.detail(variables.id), response);
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists()
      });
    }
  });
}
