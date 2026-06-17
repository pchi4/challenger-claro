import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "../../../shared/types/api";
import { getTeamById } from "../api/teamsApi";
import { teamQueryKeys } from "../constants/teamQueryKeys";
import { Team } from "../types/team.types";

export function useTeam(id: string): UseQueryResult<ApiResponse<Team>, Error> {
  return useQuery({
    queryKey: teamQueryKeys.detail(id),
    queryFn: () => getTeamById(id),
    enabled: id.length > 0
  });
}
