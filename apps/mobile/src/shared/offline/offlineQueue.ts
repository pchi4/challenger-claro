import { PendingMutation } from "@/shared/offline/offline.types";
import { readOfflineState, writeOfflineState } from "@/shared/offline/offlineState";

export function enqueueMutation(mutation: PendingMutation): void {
  writeOfflineState((state) => ({
    ...state,
    pendingMutations: squashPendingMutations(state.pendingMutations, mutation)
  }));
}

export function replacePendingReferences(
  queue: PendingMutation[],
  sourceId: string,
  targetId: string
): PendingMutation[] {
  return queue.map((mutation) => {
    switch (mutation.type) {
      case "createTask":
        return {
          ...mutation,
          payload: {
            ...mutation.payload,
            teamIds: mutation.payload.teamIds?.map((teamId) =>
              teamId === sourceId ? targetId : teamId
            )
          }
        };
      case "updateTask":
        return {
          ...mutation,
          id: mutation.id === sourceId ? targetId : mutation.id,
          payload: {
            ...mutation.payload,
            teamIds: mutation.payload.teamIds?.map((teamId) =>
              teamId === sourceId ? targetId : teamId
            )
          }
        };
      case "updateTaskStatus":
      case "deleteTask":
      case "updateTeam":
      case "deleteTeam":
        return {
          ...mutation,
          id: mutation.id === sourceId ? targetId : mutation.id
        };
      case "createTeam":
        return mutation.clientId === sourceId
          ? {
              ...mutation,
              clientId: targetId
            }
          : mutation;
    }
  });
}

export function hasPendingOfflineMutations(): boolean {
  return readOfflineState().pendingMutations.length > 0;
}

function squashPendingMutations(
  currentQueue: PendingMutation[],
  nextMutation: PendingMutation
): PendingMutation[] {
  switch (nextMutation.type) {
    case "createTeam":
    case "createTask":
      return [...currentQueue, nextMutation];
    case "updateTeam": {
      const createIndex = currentQueue.findIndex(
        (item) => item.type === "createTeam" && item.clientId === nextMutation.id
      );

      if (createIndex >= 0) {
        const createMutation = currentQueue[createIndex] as Extract<
          PendingMutation,
          { type: "createTeam" }
        >;
        return currentQueue.map((item, index) =>
          index === createIndex
            ? {
                ...createMutation,
                payload: {
                  ...createMutation.payload,
                  ...nextMutation.payload
                }
              }
            : item
        );
      }

      return [
        ...currentQueue.filter(
          (item) => !(item.type === "updateTeam" && item.id === nextMutation.id)
        ),
        nextMutation
      ];
    }
    case "updateTask": {
      const createIndex = currentQueue.findIndex(
        (item) => item.type === "createTask" && item.clientId === nextMutation.id
      );

      if (createIndex >= 0) {
        const createMutation = currentQueue[createIndex] as Extract<
          PendingMutation,
          { type: "createTask" }
        >;
        return currentQueue.map((item, index) =>
          index === createIndex
            ? {
                ...createMutation,
                payload: {
                  ...createMutation.payload,
                  ...nextMutation.payload
                }
              }
            : item
        );
      }

      return [
        ...currentQueue.filter(
          (item) =>
            !(
              (item.type === "updateTask" || item.type === "updateTaskStatus") &&
              item.id === nextMutation.id
            )
        ),
        nextMutation
      ];
    }
    case "updateTaskStatus": {
      const createIndex = currentQueue.findIndex(
        (item) => item.type === "createTask" && item.clientId === nextMutation.id
      );

      if (createIndex >= 0) {
        const createMutation = currentQueue[createIndex] as Extract<
          PendingMutation,
          { type: "createTask" }
        >;
        return currentQueue.map((item, index) =>
          index === createIndex
            ? {
                ...createMutation,
                payload: {
                  ...createMutation.payload,
                  status: nextMutation.status
                }
              }
            : item
        );
      }

      const updateIndex = currentQueue.findIndex(
        (item) => item.type === "updateTask" && item.id === nextMutation.id
      );

      if (updateIndex >= 0) {
        const updateMutation = currentQueue[updateIndex] as Extract<
          PendingMutation,
          { type: "updateTask" }
        >;

        return currentQueue.map((item, index) =>
          index === updateIndex
            ? {
                ...updateMutation,
                payload: {
                  ...updateMutation.payload,
                  status: nextMutation.status
                }
              }
            : item
        );
      }

      return [
        ...currentQueue.filter(
          (item) =>
            !(item.type === "updateTaskStatus" && item.id === nextMutation.id)
        ),
        nextMutation
      ];
    }
    case "deleteTeam": {
      const createIndex = currentQueue.findIndex(
        (item) => item.type === "createTeam" && item.clientId === nextMutation.id
      );

      if (createIndex >= 0) {
        return currentQueue.filter((_item, index) => index !== createIndex);
      }

      return [
        ...currentQueue.filter(
          (item) =>
            !(
              (item.type === "updateTeam" || item.type === "deleteTeam") &&
              item.id === nextMutation.id
            )
        ),
        nextMutation
      ];
    }
    case "deleteTask": {
      const createIndex = currentQueue.findIndex(
        (item) => item.type === "createTask" && item.clientId === nextMutation.id
      );

      if (createIndex >= 0) {
        return currentQueue.filter((_item, index) => index !== createIndex);
      }

      return [
        ...currentQueue.filter(
          (item) =>
            !(
              (item.type === "updateTask" ||
                item.type === "updateTaskStatus" ||
                item.type === "deleteTask") &&
              item.id === nextMutation.id
            )
        ),
        nextMutation
      ];
    }
  }
}
