import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { createTeam } from "../api/teamsApi";
import { teamQueryKeys } from "../constants/teamQueryKeys";
import { CreateTeamPayload, Team } from "../types/team.types";

export function useCreateTeam(): UseMutationResult<
  ApiResponse<Team>,
  Error,
  CreateTeamPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: teamQueryKeys.lists()
      });
    }
  });
}
