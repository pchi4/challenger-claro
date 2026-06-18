import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import { Team, UpdateTeamPayload } from "@/features/teams/types/team.types";
import { updateTeamWithOffline } from "@/shared/offline/offlineApi";

interface UpdateTeamVariables {
  id: string;
  payload: UpdateTeamPayload;
}

export function useUpdateTeam(): UseMutationResult<
  ApiResponse<Team>,
  Error,
  UpdateTeamVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateTeamWithOffline(id, payload),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(teamQueryKeys.detail(variables.id), response);
      void queryClient.invalidateQueries({
        queryKey: teamQueryKeys.lists()
      });
    }
  });
}
