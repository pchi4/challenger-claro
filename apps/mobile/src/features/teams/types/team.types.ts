export interface Team {
  id: string;
  name: string;
  colorHex: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetTeamsParams
  extends Record<string, string | number | boolean | undefined> {
  limit?: number;
  offset?: number;
  search?: string;
}

export interface CreateTeamPayload {
  name: string;
  colorHex: string;
  description?: string;
}

export type UpdateTeamPayload = Partial<CreateTeamPayload>;
