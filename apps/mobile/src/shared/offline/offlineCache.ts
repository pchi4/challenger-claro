import {
  GetTasksParams,
  Task
} from "@/features/tasks/types/task.types";
import {
  GetTeamsParams,
  Team
} from "@/features/teams/types/team.types";
import { replacePendingReferences } from "@/shared/offline/offlineQueue";
import { readOfflineState, setPendingMutations, writeOfflineState } from "@/shared/offline/offlineState";
import { buildTasksResponse, buildTeamsResponse, mergeTasks, mergeTeams } from "@/shared/offline/offlineUtils";
import { ApiResponse } from "@/shared/types/api";
import { PendingMutation } from "@/shared/offline/offline.types";

export function getInitialTeamsResponse(
  params: GetTeamsParams = {}
): ApiResponse<Team[]> | undefined {
  const state = readOfflineState();

  if (state.teams.length === 0) {
    return undefined;
  }

  return buildTeamsResponse(state.teams, params);
}

export function getInitialTeamDetail(id: string): ApiResponse<Team> | undefined {
  const state = readOfflineState();
  const team = state.teams.find((item) => item.id === id || state.idMappings[id] === item.id);

  if (team === undefined) {
    return undefined;
  }

  return {
    data: team
  };
}

export function getInitialTasksResponse(
  params: GetTasksParams = {}
): ApiResponse<Task[]> | undefined {
  const state = readOfflineState();

  if (state.tasks.length === 0) {
    return undefined;
  }

  return buildTasksResponse(state.tasks, state.idMappings, params);
}

export function getInitialTaskDetail(id: string): ApiResponse<Task> | undefined {
  const state = readOfflineState();
  const resolvedId = state.idMappings[id] ?? id;
  const task = state.tasks.find((item) => item.id === id || item.id === resolvedId);

  if (task === undefined) {
    return undefined;
  }

  return {
    data: task
  };
}

export function saveTeams(teams: Team[]): void {
  writeOfflineState((state) => ({
    ...state,
    teams: mergeTeams(state.teams, teams)
  }));
}

export function saveTeam(team: Team): void {
  saveTeams([team]);
}

export function saveTasks(tasks: Task[]): void {
  writeOfflineState((state) => ({
    ...state,
    teams: mergeTeams(state.teams, tasks.flatMap((task) => task.teams)),
    tasks: mergeTasks(state.tasks, tasks)
  }));
}

export function saveTask(task: Task): void {
  saveTasks([task]);
}

export function removeTeamFromStorage(id: string): void {
  writeOfflineState((state) => {
    const resolvedId = state.idMappings[id] ?? id;

    return {
      ...state,
      tasks: state.tasks.map((task) => ({
        ...task,
        teams: task.teams.filter((team) => team.id !== resolvedId)
      })),
      teams: state.teams.filter((team) => team.id !== id && team.id !== resolvedId)
    };
  });
}

export function removeTaskFromStorage(id: string): void {
  writeOfflineState((state) => {
    const resolvedId = state.idMappings[id] ?? id;

    return {
      ...state,
      tasks: state.tasks.filter((task) => task.id !== id && task.id !== resolvedId)
    };
  });
}

export function replaceOfflineTeamId(
  clientId: string,
  serverTeam: Team
): void {
  writeOfflineState((state) => {
    const nextMappings = {
      ...state.idMappings,
      [clientId]: serverTeam.id
    };

    const nextTeams = state.teams.map((team) =>
      team.id === clientId ? serverTeam : team
    );
    const nextTasks = state.tasks.map((task) => ({
      ...task,
      teams: task.teams.map((team) =>
        team.id === clientId ? serverTeam : team
      )
    }));
    const nextQueue = replacePendingReferences(
      state.pendingMutations,
      clientId,
      serverTeam.id
    );

    return {
      ...state,
      idMappings: nextMappings,
      pendingMutations: nextQueue,
      tasks: nextTasks,
      teams: mergeTeams(nextTeams, [serverTeam])
    };
  });
}

export function replaceOfflineTaskId(
  clientId: string,
  serverTask: Task
): void {
  writeOfflineState((state) => ({
    ...state,
    idMappings: {
      ...state.idMappings,
      [clientId]: serverTask.id
    },
    pendingMutations: replacePendingReferences(
      state.pendingMutations,
      clientId,
      serverTask.id
    ),
    tasks: mergeTasks(
      state.tasks.map((task) => (task.id === clientId ? serverTask : task)),
      [serverTask]
    ),
    teams: mergeTeams(state.teams, serverTask.teams)
  }));
}

export function replacePendingQueue(pendingMutations: PendingMutation[]): void {
  setPendingMutations(pendingMutations);
}
