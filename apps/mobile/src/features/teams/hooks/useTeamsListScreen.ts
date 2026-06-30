import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useTeams } from "@/features/teams/hooks/useTeams";

export function useTeamsListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const queryParams = useMemo(
    () => ({
      limit: 100,
      offset: 0,
      search: search.trim().length > 0 ? search.trim() : undefined,
    }),
    [search],
  );
  const teamsQuery = useTeams(queryParams);

  function handleTeamPress(id: string, name: string): void {
    router.push({
      pathname: "/tasks",
      params: {
        teamId: id,
        teamName: name,
      },
    });
  }

  function handleSearchChange(value: string): void {
    setSearch(value);
  }

  function handleCreateTeam(): void {
    router.push("/teams/create");
  }

  function handleEditTeam(id: string): void {
    router.push(`/teams/${id}/edit`);
  }

  function handleViewAllTasks(): void {
    router.push("/tasks");
  }

  return {
    teams: teamsQuery.data?.data ?? [],
    total: teamsQuery.data?.meta?.total ?? 0,
    search,
    isLoading: teamsQuery.isLoading,
    isError: teamsQuery.isError,
    errorMessage:
      teamsQuery.error?.message ?? "Não foi possível carregar os times.",
    handleTeamPress,
    handleSearchChange,
    handleCreateTeam,
    handleEditTeam,
    handleViewAllTasks,
    retry: teamsQuery.refetch,
  };
}
