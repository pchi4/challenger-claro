import {
  CreateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskPayload,
} from "@/features/tasks/types/task.types";
import {
  CreateTeamPayload,
  Team,
  UpdateTeamPayload,
} from "@/features/teams/types/team.types";
import { enqueueMutation } from "@/shared/offline/offlineQueue";
import {
  readOfflineState,
  writeOfflineState,
} from "@/shared/offline/offlineState";
import {
  removeTaskFromStorage,
  removeTeamFromStorage,
  saveTask,
  saveTeam,
} from "@/shared/offline/offlineCache";
import { createOfflineId } from "@/shared/offline/offlineUtils";
import { ApiResponse } from "@/shared/types/api";

export function createOfflineTeam(
  payload: CreateTeamPayload,
): ApiResponse<Team> {
  const now = new Date().toISOString();
  const team: Team = {
    id: createOfflineId("team"),
    name: payload.name,
    colorHex: payload.colorHex,
    description: payload.description ?? null,
    createdAt: now,
    updatedAt: now,
  };

  saveTeam(team);
  enqueueMutation({
    type: "createTeam",
    clientId: team.id,
    payload,
  });

  return {
    data: team,
  };
}

export function createOfflineTask(
  payload: CreateTaskPayload,
): ApiResponse<Task> {
  const state = readOfflineState();
  const now = new Date().toISOString();
  const resolvedTeamIds = new Set(
    (payload.teamIds ?? []).map((teamId) => state.idMappings[teamId] ?? teamId),
  );
  const task: Task = {
    id: createOfflineId("task"),
    title: payload.title,
    description: payload.description ?? null,
    status: payload.status ?? "PENDING",
    dueDate: payload.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
    teams: state.teams.filter((team) => resolvedTeamIds.has(team.id)),
  };

  saveTask(task);
  enqueueMutation({
    type: "createTask",
    clientId: task.id,
    payload,
  });

  return {
    data: task,
  };
}

export function updateOfflineTeam(
  id: string,
  payload: UpdateTeamPayload,
): ApiResponse<Team> | undefined {
  let updatedTeam: Team | undefined;

  writeOfflineState((state) => {
    const resolvedId = state.idMappings[id] ?? id;
    const nextTeams = state.teams.map((team) => {
      if (team.id !== resolvedId && team.id !== id) {
        return team;
      }

      updatedTeam = {
        ...team,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      return updatedTeam;
    });

    const nextTasks = state.tasks.map((task) => ({
      ...task,
      teams: task.teams.map((team) =>
        team.id === updatedTeam?.id ? updatedTeam : team,
      ),
    }));

    return {
      ...state,
      tasks: nextTasks,
      teams: nextTeams,
    };
  });

  if (updatedTeam === undefined) {
    return undefined;
  }

  enqueueMutation({
    type: "updateTeam",
    id,
    payload,
  });

  return {
    data: updatedTeam,
  };
}

export function updateOfflineTask(
  id: string,
  payload: UpdateTaskPayload,
): ApiResponse<Task> | undefined {
  let updatedTask: Task | undefined;

  writeOfflineState((state) => {
    const resolvedId = state.idMappings[id] ?? id;
    const resolvedTeamIds =
      payload.teamIds?.map((teamId) => state.idMappings[teamId] ?? teamId) ??
      [];

    const nextTasks = state.tasks.map((task) => {
      if (task.id !== resolvedId && task.id !== id) {
        return task;
      }

      updatedTask = {
        ...task,
        title: payload.title ?? task.title,
        description: payload.description ?? task.description,
        status: payload.status ?? task.status,
        dueDate: payload.dueDate ?? task.dueDate,
        teams:
          payload.teamIds === undefined
            ? task.teams
            : state.teams.filter((team) => resolvedTeamIds.includes(team.id)),
        updatedAt: new Date().toISOString(),
      };

      return updatedTask;
    });

    return {
      ...state,
      tasks: nextTasks,
    };
  });

  if (updatedTask === undefined) {
    return undefined;
  }

  enqueueMutation({
    type: "updateTask",
    id,
    payload,
  });

  return {
    data: updatedTask,
  };
}

export function updateOfflineTaskStatus(
  id: string,
  status: TaskStatus,
): ApiResponse<Task> | undefined {
  const response = updateOfflineTask(id, {
    status,
  });

  if (response === undefined) {
    return undefined;
  }

  enqueueMutation({
    type: "updateTaskStatus",
    id,
    status,
  });

  return response;
}

export function deleteOfflineTeam(id: string): void {
  removeTeamFromStorage(id);
  enqueueMutation({
    type: "deleteTeam",
    id,
  });
}

export function deleteOfflineTask(id: string): void {
  removeTaskFromStorage(id);
  enqueueMutation({
    type: "deleteTask",
    id,
  });
}
