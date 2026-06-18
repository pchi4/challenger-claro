import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import { Team } from "@/features/teams/types/team.types";
import { deleteTeamWithOffline } from "@/shared/offline/offlineApi";

export function useDeleteTeam(): UseMutationResult<
  ApiResponse<Team>,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeamWithOffline,
    onSuccess: (_response, id) => {
      void queryClient.removeQueries({
        queryKey: teamQueryKeys.detail(id)
      });
      void queryClient.invalidateQueries({
        queryKey: teamQueryKeys.lists()
      });
    }
  });
}
