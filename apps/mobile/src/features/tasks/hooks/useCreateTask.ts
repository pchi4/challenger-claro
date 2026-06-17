import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { createTask } from "../api/tasksApi";
import { taskQueryKeys } from "../constants/taskQueryKeys";
import { CreateTaskPayload, Task } from "../types/task.types";

export function useCreateTask(): UseMutationResult<
  ApiResponse<Task>,
  Error,
  CreateTaskPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists()
      });
    }
  });
}
