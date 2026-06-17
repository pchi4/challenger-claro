import {
  useMutation,
  useQueryClient,
  UseMutationResult
} from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { updateTeam } from "../api/teamsApi";
import { teamQueryKeys } from "../constants/teamQueryKeys";
import { Team, UpdateTeamPayload } from "../types/team.types";

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
    mutationFn: ({ id, payload }) => updateTeam(id, payload),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(teamQueryKeys.detail(variables.id), response);
      void queryClient.invalidateQueries({
        queryKey: teamQueryKeys.lists()
      });
    }
  });
}
