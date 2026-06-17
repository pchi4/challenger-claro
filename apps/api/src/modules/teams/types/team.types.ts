import { Team } from "@prisma/client";
import { PaginationMeta } from "../../../common/types/api-response";

export type TeamEntity = Team;

export interface ListTeamsQuery {
  limit: number;
  offset: number;
  search?: string;
}

export interface ListTeamsResult {
  teams: TeamEntity[];
  meta: PaginationMeta;
}

export interface CreateTeamInput {
  name: string;
  colorHex: string;
  description?: string;
}

export type UpdateTeamInput = Partial<CreateTeamInput>;
