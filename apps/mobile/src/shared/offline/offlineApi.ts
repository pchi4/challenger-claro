import NetInfo from "@react-native-community/netinfo";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus
} from "@/features/tasks/api/tasksApi";
import {
  CreateTaskPayload,
  GetTasksParams,
  Task,
  TaskStatus,
  UpdateTaskPayload
} from "@/features/tasks/types/task.types";
import {
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  updateTeam
} from "@/features/teams/api/teamsApi";
import {
  CreateTeamPayload,
  GetTeamsParams,
  Team,
  UpdateTeamPayload
} from "@/features/teams/types/team.types";
import { ApiResponse } from "@/shared/types/api";
import {
  createOfflineTask,
  createOfflineTeam,
  deleteOfflineTask,
  deleteOfflineTeam,
  getInitialTaskDetail,
  getInitialTasksResponse,
  getInitialTeamDetail,
  getInitialTeamsResponse,
  getResolvedId,
  saveTask,
  saveTasks,
  saveTeam,
  saveTeams,
  updateOfflineTask,
  updateOfflineTaskStatus,
  updateOfflineTeam
} from "@/shared/offline/offlineStorage";

export {
  getInitialTaskDetail,
  getInitialTasksResponse,
  getInitialTeamDetail,
  getInitialTeamsResponse
};

export async function getTeamsWithOffline(
  params: GetTeamsParams = {}
): Promise<ApiResponse<Team[]>> {
  try {
    const response = await getTeams(params);
    saveTeams(response.data);
    return response;
  } catch (error) {
    const cachedResponse = getInitialTeamsResponse(params);

    if (cachedResponse !== undefined && isNetworkError(error)) {
      return cachedResponse;
    }

    throw error;
  }
}

export async function getTeamByIdWithOffline(
  id: string
): Promise<ApiResponse<Team>> {
  const resolvedId = getResolvedId(id);

  try {
    const response = await getTeamById(resolvedId);
    saveTeam(response.data);
    return response;
  } catch (error) {
    const cachedResponse = getInitialTeamDetail(id);

    if (cachedResponse !== undefined && isNetworkError(error)) {
      return cachedResponse;
    }

    throw error;
  }
}

export async function getTasksWithOffline(
  params: GetTasksParams = {}
): Promise<ApiResponse<Task[]>> {
  try {
    const response = await getTasks(params);
    saveTasks(response.data);
    return response;
  } catch (error) {
    const cachedResponse = getInitialTasksResponse(params);

    if (cachedResponse !== undefined && isNetworkError(error)) {
      return cachedResponse;
    }

    throw error;
  }
}

export async function getTaskByIdWithOffline(
  id: string
): Promise<ApiResponse<Task>> {
  const resolvedId = getResolvedId(id);

  try {
    const response = await getTaskById(resolvedId);
    saveTask(response.data);
    return response;
  } catch (error) {
    const cachedResponse = getInitialTaskDetail(id);

    if (cachedResponse !== undefined && isNetworkError(error)) {
      return cachedResponse;
    }

    throw error;
  }
}

export async function createTeamWithOffline(
  payload: CreateTeamPayload
): Promise<ApiResponse<Team>> {
  if ((await NetInfo.fetch()).isConnected !== true) {
    return createOfflineTeam(payload);
  }

  try {
    const response = await createTeam(payload);
    saveTeam(response.data);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      return createOfflineTeam(payload);
    }

    throw error;
  }
}

export async function updateTeamWithOffline(
  id: string,
  payload: UpdateTeamPayload
): Promise<ApiResponse<Team>> {
  const resolvedId = getResolvedId(id);

  if ((await NetInfo.fetch()).isConnected !== true) {
    const offlineResponse = updateOfflineTeam(id, payload);

    if (offlineResponse !== undefined) {
      return offlineResponse;
    }
  }

  try {
    const response = await updateTeam(resolvedId, payload);
    saveTeam(response.data);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      const offlineResponse = updateOfflineTeam(id, payload);

      if (offlineResponse !== undefined) {
        return offlineResponse;
      }
    }

    throw error;
  }
}

export async function deleteTeamWithOffline(id: string): Promise<ApiResponse<Team>> {
  const cachedTeam = getInitialTeamDetail(id);
  const resolvedId = getResolvedId(id);

  if ((await NetInfo.fetch()).isConnected !== true) {
    deleteOfflineTeam(id);
    return cachedTeam ?? buildFallbackTeamResponse(id);
  }

  try {
    const response = await deleteTeam(resolvedId);
    deleteOfflineTeam(id);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      deleteOfflineTeam(id);
      return cachedTeam ?? buildFallbackTeamResponse(id);
    }

    throw error;
  }
}

export async function createTaskWithOffline(
  payload: CreateTaskPayload
): Promise<ApiResponse<Task>> {
  if ((await NetInfo.fetch()).isConnected !== true) {
    return createOfflineTask(payload);
  }

  try {
    const response = await createTask(payload);
    saveTask(response.data);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      return createOfflineTask(payload);
    }

    throw error;
  }
}

export async function updateTaskWithOffline(
  id: string,
  payload: UpdateTaskPayload
): Promise<ApiResponse<Task>> {
  const resolvedId = getResolvedId(id);

  if ((await NetInfo.fetch()).isConnected !== true) {
    const offlineResponse = updateOfflineTask(id, payload);

    if (offlineResponse !== undefined) {
      return offlineResponse;
    }
  }

  try {
    const response = await updateTask(resolvedId, payload);
    saveTask(response.data);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      const offlineResponse = updateOfflineTask(id, payload);

      if (offlineResponse !== undefined) {
        return offlineResponse;
      }
    }

    throw error;
  }
}

export async function updateTaskStatusWithOffline(
  id: string,
  status: TaskStatus
): Promise<ApiResponse<Task>> {
  const resolvedId = getResolvedId(id);

  if ((await NetInfo.fetch()).isConnected !== true) {
    const offlineResponse = updateOfflineTaskStatus(id, status);

    if (offlineResponse !== undefined) {
      return offlineResponse;
    }
  }

  try {
    const response = await updateTaskStatus(resolvedId, status);
    saveTask(response.data);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      const offlineResponse = updateOfflineTaskStatus(id, status);

      if (offlineResponse !== undefined) {
        return offlineResponse;
      }
    }

    throw error;
  }
}

export async function deleteTaskWithOffline(id: string): Promise<ApiResponse<null>> {
  const resolvedId = getResolvedId(id);

  if ((await NetInfo.fetch()).isConnected !== true) {
    deleteOfflineTask(id);
    return {
      data: null
    };
  }

  try {
    const response = await deleteTask(resolvedId);
    deleteOfflineTask(id);
    return response;
  } catch (error) {
    if (isNetworkError(error)) {
      deleteOfflineTask(id);
      return {
        data: null
      };
    }

    throw error;
  }
}

function buildFallbackTeamResponse(id: string): ApiResponse<Team> {
  return {
    data: {
      id,
      name: "",
      colorHex: "#000000",
      description: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
}

function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    error.name === "TypeError" ||
    message.includes("network request failed") ||
    message.includes("fetch failed") ||
    message.includes("connectexception") ||
    message.includes("failed to connect")
  );
}
