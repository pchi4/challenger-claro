import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import { CreateTeamPayload, Team } from "@/features/teams/types/team.types";
import { createTeamWithOffline } from "@/shared/offline/offlineApi";

export function useCreateTeam(): UseMutationResult<
  ApiResponse<Team>,
  Error,
  CreateTeamPayload
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeamWithOffline,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: teamQueryKeys.lists()
      });
    }
  });
}
