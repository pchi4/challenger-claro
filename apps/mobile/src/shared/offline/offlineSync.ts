import NetInfo from "@react-native-community/netinfo";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus
} from "@/features/tasks/api/tasksApi";
import { createTeam, deleteTeam, updateTeam } from "@/features/teams/api/teamsApi";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import {
  getPendingMutations,
  getResolvedId,
  readOfflineState,
  removeTaskFromStorage,
  removeTeamFromStorage,
  replaceOfflineTaskId,
  replaceOfflineTeamId,
  replacePendingQueue,
  saveTask,
  saveTeam
} from "@/shared/offline/offlineStorage";
import { PendingMutation } from "@/shared/offline/offline.types";
import { QueryClient } from "@tanstack/react-query";

let isSyncing = false;

export async function syncOfflineMutations(
  queryClient: QueryClient
): Promise<void> {
  if (isSyncing) {
    return;
  }

  if ((await NetInfo.fetch()).isConnected !== true) {
    return;
  }

  const queue = getPendingMutations();

  if (queue.length === 0) {
    return;
  }

  isSyncing = true;

  try {
    const remainingQueue: PendingMutation[] = [];

    for (const mutation of queue) {
      try {
        await processMutation(mutation);
      } catch {
        remainingQueue.push(mutation, ...queue.slice(queue.indexOf(mutation) + 1));
        break;
      }
    }

    replacePendingQueue(remainingQueue);
    await queryClient.invalidateQueries({
      queryKey: teamQueryKeys.all
    });
    await queryClient.invalidateQueries({
      queryKey: taskQueryKeys.all
    });
  } finally {
    isSyncing = false;
  }
}

async function processMutation(mutation: PendingMutation): Promise<void> {
  switch (mutation.type) {
    case "createTeam": {
      const response = await createTeam(mutation.payload);
      saveTeam(response.data);
      replaceOfflineTeamId(mutation.clientId, response.data);
      return;
    }
    case "updateTeam": {
      const response = await updateTeam(getResolvedId(mutation.id), mutation.payload);
      saveTeam(response.data);
      return;
    }
    case "deleteTeam": {
      await deleteTeam(getResolvedId(mutation.id));
      removeTeamFromStorage(mutation.id);
      return;
    }
    case "createTask": {
      const response = await createTask({
        ...mutation.payload,
        teamIds: mutation.payload.teamIds?.map((teamId) => getResolvedId(teamId))
      });
      saveTask(response.data);
      replaceOfflineTaskId(mutation.clientId, response.data);
      return;
    }
    case "updateTask": {
      const response = await updateTask(getResolvedId(mutation.id), {
        ...mutation.payload,
        teamIds: mutation.payload.teamIds?.map((teamId) => getResolvedId(teamId))
      });
      saveTask(response.data);
      return;
    }
    case "deleteTask": {
      await deleteTask(getResolvedId(mutation.id));
      removeTaskFromStorage(mutation.id);
      return;
    }
    case "updateTaskStatus": {
      const response = await updateTaskStatus(
        getResolvedId(mutation.id),
        mutation.status
      );
      saveTask(response.data);
      return;
    }
  }
}

export function hasPendingOfflineMutations(): boolean {
  return readOfflineState().pendingMutations.length > 0;
}
