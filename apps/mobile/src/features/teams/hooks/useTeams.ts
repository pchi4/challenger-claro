import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { getTeams } from "../api/teamsApi";
import { teamQueryKeys } from "../constants/teamQueryKeys";
import { GetTeamsParams, Team } from "../types/team.types";

export function useTeams(
  params: GetTeamsParams = {}
): UseQueryResult<ApiResponse<Team[]>, Error> {
  return useQuery({
    queryKey: teamQueryKeys.list(params),
    queryFn: () => getTeams(params)
  });
}
