import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { deleteTaskWithOffline } from "@/shared/offline/offlineApi";

export function useDeleteTask(): UseMutationResult<
  ApiResponse<null>,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskWithOffline,
    onSuccess: (_response, id) => {
      queryClient.removeQueries({
        queryKey: taskQueryKeys.detail(id),
      });
      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.lists(),
      });
    },
  });
}
