import NetInfo from "@react-native-community/netinfo";
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus
} from "@/features/tasks/api/tasksApi";
import { createTeam, deleteTeam, updateTeam } from "@/features/teams/api/teamsApi";
import { HttpClientError } from "@/shared/api/httpClient";
import { taskQueryKeys } from "@/features/tasks/constants/taskQueryKeys";
import { teamQueryKeys } from "@/features/teams/constants/teamQueryKeys";
import {
  getPendingMutations,
  getResolvedId,
  getOfflineTelemetrySnapshot,
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
import {
  recordMutationDropped,
  recordMutationRetried,
  recordSyncCompleted,
  recordSyncSkipped,
  recordSyncStarted
} from "@/shared/offline/offlineTelemetry";
import { QueryClient } from "@tanstack/react-query";

let isSyncing = false;

export async function syncOfflineMutations(
  queryClient: QueryClient
): Promise<void> {
  if (isSyncing) {
    recordSyncSkipped("already_syncing", getOfflineTelemetrySnapshot().lastQueueSize);
    return;
  }

  if ((await NetInfo.fetch()).isConnected !== true) {
    recordSyncSkipped("offline", getPendingMutations().length);
    return;
  }

  const queue = getPendingMutations();

  if (queue.length === 0) {
    recordSyncSkipped("empty_queue", 0);
    return;
  }

  isSyncing = true;
  recordSyncStarted(queue.length);

  try {
    const remainingQueue: PendingMutation[] = [];
    let processedCount = 0;

    for (const [index, mutation] of queue.entries()) {
      try {
        await processMutation(mutation);
        processedCount += 1;
      } catch (error) {
        if (isRetryableSyncError(error)) {
          recordMutationRetried(mutation.type);
          remainingQueue.push(mutation, ...queue.slice(index + 1));
          break;
        }

        recordMutationDropped(
          mutation.type,
          error instanceof Error ? error.message : "unknown_error"
        );
        console.warn("Dropping offline mutation after permanent sync failure", {
          mutationType: mutation.type,
          error
        });
      }
    }

    replacePendingQueue(remainingQueue);
    recordSyncCompleted(processedCount, remainingQueue.length);
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

function isRetryableSyncError(error: unknown): boolean {
  if (error instanceof HttpClientError) {
    if (error.status === 404) {
      return false;
    }

    if (
      error.status >= 400 &&
      error.status < 500 &&
      error.status !== 408 &&
      error.status !== 429
    ) {
      return false;
    }

    return true;
  }

  return true;
}
