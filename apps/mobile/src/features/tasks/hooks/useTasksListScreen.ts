import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TaskStatus } from "@/features/tasks/types/task.types";
import { useTasks } from "@/features/tasks/hooks/useTasks";

const PAGE_SIZE = 10;

export function useTasksListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    teamId?: string;
    teamName?: string;
  }>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const teamId = normalizeParam(params.teamId);
  const teamName = normalizeParam(params.teamName);

  const queryParams = useMemo(
    () => ({
      teamId,
      search: search.trim().length > 0 ? search.trim() : undefined,
      status,
      limit,
      offset: 0,
      sort: "createdAt:desc" as const
    }),
    [limit, search, status, teamId]
  );

  const tasksQuery = useTasks(queryParams);
  const tasks = tasksQuery.data?.data ?? [];
  const total = tasksQuery.data?.meta?.total ?? 0;
  const canLoadMore = tasks.length < total;

  function handleSearchChange(value: string): void {
    setSearch(value);
    setLimit(PAGE_SIZE);
  }

  function handleStatusChange(nextStatus: TaskStatus | undefined): void {
    setStatus(nextStatus);
    setLimit(PAGE_SIZE);
  }

  function handleLoadMore(): void {
    if (tasksQuery.isFetching || !canLoadMore) {
      return;
    }

    setLimit((currentLimit) => currentLimit + PAGE_SIZE);
  }

  function handleTaskPress(id: string): void {
    router.push({
      pathname: "/tasks/[id]",
      params: {
        id,
        teamId,
        teamName
      }
    });
  }

  function handleCreateTask(): void {
    router.push({
      pathname: "/tasks/create",
      params: {
        teamId,
        teamName
      }
    });
  }

  function handleTeamsPress(): void {
    router.push("/teams");
  }

  function handleClearTeamFilter(): void {
    setLimit(PAGE_SIZE);
    router.replace("/tasks");
  }

  return {
    tasks,
    total,
    search,
    status,
    teamId,
    teamName,
    isTeamFiltered: teamId !== undefined,
    canLoadMore,
    isLoading: tasksQuery.isLoading,
    isFetching: tasksQuery.isFetching,
    isError: tasksQuery.isError,
    errorMessage: tasksQuery.error?.message ?? "Não foi possível carregar as tarefas.",
    handleSearchChange,
    handleStatusChange,
    handleLoadMore,
    handleTaskPress,
    handleCreateTask,
    handleTeamsPress,
    handleClearTeamFilter,
    retry: tasksQuery.refetch
  };
}

function normalizeParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
