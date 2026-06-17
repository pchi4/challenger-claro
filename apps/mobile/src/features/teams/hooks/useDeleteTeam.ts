import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { deleteTeam } from "../api/teamsApi";
import { teamQueryKeys } from "../constants/teamQueryKeys";
import { Team } from "../types/team.types";

export function useDeleteTeam(): UseMutationResult<
  ApiResponse<Team>,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
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
