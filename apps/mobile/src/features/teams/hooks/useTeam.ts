import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/api";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import { Team } from "@/features/teams/types/team.types";
import {
  getInitialTeamDetail,
  getTeamByIdWithOffline
} from "@/shared/offline/offlineApi";

export function useTeam(id: string): UseQueryResult<ApiResponse<Team>, Error> {
  return useQuery({
    queryKey: teamQueryKeys.detail(id),
    queryFn: () => getTeamByIdWithOffline(id),
    initialData: getInitialTeamDetail(id),
    enabled: id.length > 0
  });
}
