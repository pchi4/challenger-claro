import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import { GetTeamsParams, Team } from "@/features/teams/types/team.types";
import {
  getInitialTeamsResponse,
  getTeamsWithOffline
} from "@/shared/offline/offlineApi";

export function useTeams(
  params: GetTeamsParams = {}
): UseQueryResult<ApiResponse<Team[]>, Error> {
  return useQuery({
    queryKey: teamQueryKeys.list(params),
    queryFn: () => getTeamsWithOffline(params),
    initialData: getInitialTeamsResponse(params)
  });
}
