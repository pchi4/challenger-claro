import {
  GetTasksParams,
  Task,
  TaskSort
} from "@/features/tasks/types/task.types";
import { GetTeamsParams, Team } from "@/features/teams/types/team.types";
import { ApiResponse } from "@/shared/types/api";

export function buildTeamsResponse(
  teams: Team[],
  params: GetTeamsParams
): ApiResponse<Team[]> {
  const search = params.search?.trim().toLowerCase();
  const filteredTeams =
    search === undefined || search.length === 0
      ? teams
      : teams.filter((team) =>
          [team.name, team.description ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(search)
        );
  const offset = params.offset ?? 0;
  const limit = params.limit ?? filteredTeams.length;

  return {
    data: filteredTeams.slice(offset, offset + limit),
    meta: {
      total: filteredTeams.length,
      limit,
      offset
    }
  };
}

export function buildTasksResponse(
  tasks: Task[],
  mappings: Record<string, string>,
  params: GetTasksParams
): ApiResponse<Task[]> {
  let filteredTasks = [...tasks];

  if (params.teamId !== undefined) {
    const resolvedTeamId = mappings[params.teamId] ?? params.teamId;
    filteredTasks = filteredTasks.filter((task) =>
      task.teams.some((team) => team.id === resolvedTeamId || team.id === params.teamId)
    );
  }

  if (params.status !== undefined) {
    filteredTasks = filteredTasks.filter((task) => task.status === params.status);
  }

  const search = params.search?.trim().toLowerCase();

  if (search !== undefined && search.length > 0) {
    filteredTasks = filteredTasks.filter((task) =>
      [task.title, task.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }

  filteredTasks = sortTasks(filteredTasks, params.sort);

  const offset = params.offset ?? 0;
  const limit = params.limit ?? filteredTasks.length;

  return {
    data: filteredTasks.slice(offset, offset + limit),
    meta: {
      total: filteredTasks.length,
      limit,
      offset
    }
  };
}

export function mergeTeams(currentTeams: Team[], nextTeams: Team[]): Team[] {
  const byId = new Map(currentTeams.map((team) => [team.id, team]));
  nextTeams.forEach((team) => {
    byId.set(team.id, team);
  });
  return Array.from(byId.values());
}

export function mergeTasks(currentTasks: Task[], nextTasks: Task[]): Task[] {
  const byId = new Map(currentTasks.map((task) => [task.id, task]));
  nextTasks.forEach((task) => {
    byId.set(task.id, task);
  });
  return Array.from(byId.values());
}

export function createOfflineId(entity: "task" | "team"): string {
  return `offline-${entity}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function sortTasks(tasks: Task[], sort: TaskSort | undefined): Task[] {
  const sortValue = sort ?? "createdAt:desc";
  const [field, direction] = sortValue.split(":") as [
    "createdAt" | "dueDate" | "title",
    "asc" | "desc"
  ];
  const multiplier = direction === "asc" ? 1 : -1;

  return [...tasks].sort((left, right) => {
    if (field === "title") {
      return left.title.localeCompare(right.title) * multiplier;
    }

    const leftValue = field === "dueDate" ? left.dueDate ?? "" : left.createdAt;
    const rightValue = field === "dueDate" ? right.dueDate ?? "" : right.createdAt;

    return leftValue.localeCompare(rightValue) * multiplier;
  });
}
