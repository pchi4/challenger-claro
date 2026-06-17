import { GetTeamsParams } from "../types/team.types";

export const teamQueryKeys = {
  all: ["teams"] as const,
  lists: () => [...teamQueryKeys.all, "list"] as const,
  list: (params: GetTeamsParams = {}) =>
    [...teamQueryKeys.lists(), params] as const,
  details: () => [...teamQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...teamQueryKeys.details(), id] as const
};
