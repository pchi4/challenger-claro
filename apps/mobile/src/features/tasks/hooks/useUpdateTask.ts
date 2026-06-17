import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { updateTask } from "../api/tasksApi";
import { taskQueryKeys } from "../constants/taskQueryKeys";
import { Task, UpdateTaskPayload } from "../types/task.types";

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
    mutationFn: ({ id, payload }) => updateTask(id, payload),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(taskQueryKeys.detail(variables.id), response);
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists()
      });
    }
  });
}
