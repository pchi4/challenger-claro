import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { deleteTask } from "../api/tasksApi";
import { taskQueryKeys } from "../constants/taskQueryKeys";

export function useDeleteTask(): UseMutationResult<
  ApiResponse<null>,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_response, id) => {
      void queryClient.removeQueries({
        queryKey: taskQueryKeys.detail(id)
      });
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists()
      });
    }
  });
}
