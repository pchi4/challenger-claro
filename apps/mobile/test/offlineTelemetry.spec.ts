import {
  getOfflineTelemetrySnapshot,
  recordMutationDropped,
  recordMutationRetried,
  recordSyncCompleted,
  recordSyncSkipped,
  recordSyncStarted,
  resetOfflineTelemetry
} from "@/shared/offline/offlineTelemetry";

describe("offlineTelemetry", () => {
  beforeEach(() => {
    resetOfflineTelemetry();
  });

  it("acumula eventos e contadores de sincronizacao", () => {
    recordSyncStarted(3);
    recordMutationRetried("updateTask");
    recordMutationDropped("deleteTask", "validation_error");
    recordSyncCompleted(2, 1);

    const snapshot = getOfflineTelemetrySnapshot();

    expect(snapshot.syncRuns).toBe(1);
    expect(snapshot.retries).toBe(1);
    expect(snapshot.droppedMutations).toBe(1);
    expect(snapshot.lastQueueSize).toBe(1);
    expect(snapshot.lastSyncedAt).toEqual(expect.any(String));
    expect(snapshot.events).toHaveLength(4);
  });

  it("registra pulos de sincronizacao com motivo", () => {
    recordSyncSkipped("offline", 4);

    expect(getOfflineTelemetrySnapshot().events).toEqual([
      expect.objectContaining({
        type: "sync_skipped",
        reason: "offline",
        queueSize: 4
      })
    ]);
  });
});
