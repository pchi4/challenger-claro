import { httpClient } from "../../../shared/api/httpClient";
import { ApiResponse } from "../../../shared/types/api";
import {
  CreateTeamPayload,
  GetTeamsParams,
  Team,
  UpdateTeamPayload
} from "../types/team.types";

export function getTeams(
  params: GetTeamsParams = {}
): Promise<ApiResponse<Team[]>> {
  return httpClient<ApiResponse<Team[]>>("/teams", {
    query: params
  });
}

export function getTeamById(id: string): Promise<ApiResponse<Team>> {
  return httpClient<ApiResponse<Team>>(`/teams/${id}`);
}

export function createTeam(
  payload: CreateTeamPayload
): Promise<ApiResponse<Team>> {
  return httpClient<ApiResponse<Team>>("/teams", {
    method: "POST",
    body: payload
  });
}

export function updateTeam(
  id: string,
  payload: UpdateTeamPayload
): Promise<ApiResponse<Team>> {
  return httpClient<ApiResponse<Team>>(`/teams/${id}`, {
    method: "PUT",
    body: payload
  });
}

export function deleteTeam(id: string): Promise<ApiResponse<Team>> {
  return httpClient<ApiResponse<Team>>(`/teams/${id}`, {
    method: "DELETE"
  });
}
