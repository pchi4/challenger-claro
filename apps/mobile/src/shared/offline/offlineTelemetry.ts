import { PendingMutation } from "@/shared/offline/offline.types";

type OfflineTelemetryEvent =
  | {
      type: "sync_started";
      queueSize: number;
      timestamp: string;
    }
  | {
      type: "sync_completed";
      processedCount: number;
      remainingCount: number;
      timestamp: string;
    }
  | {
      type: "sync_skipped";
      reason: "already_syncing" | "offline" | "empty_queue";
      queueSize: number;
      timestamp: string;
    }
  | {
      type: "mutation_retried";
      mutationType: PendingMutation["type"];
      timestamp: string;
    }
  | {
      type: "mutation_dropped";
      mutationType: PendingMutation["type"];
      timestamp: string;
      reason: string;
    };

interface OfflineTelemetryState {
  syncRuns: number;
  retries: number;
  droppedMutations: number;
  lastQueueSize: number;
  lastSyncedAt?: string;
  events: OfflineTelemetryEvent[];
}

const MAX_EVENTS = 30;

let telemetryState: OfflineTelemetryState = createInitialState();

export function recordSyncStarted(queueSize: number): void {
  telemetryState = {
    ...telemetryState,
    syncRuns: telemetryState.syncRuns + 1,
    lastQueueSize: queueSize,
    events: appendEvent({
      type: "sync_started",
      queueSize,
      timestamp: now()
    })
  };
}

export function recordSyncCompleted(
  processedCount: number,
  remainingCount: number
): void {
  telemetryState = {
    ...telemetryState,
    lastQueueSize: remainingCount,
    lastSyncedAt: now(),
    events: appendEvent({
      type: "sync_completed",
      processedCount,
      remainingCount,
      timestamp: now()
    })
  };
}

export function recordSyncSkipped(
  reason: "already_syncing" | "offline" | "empty_queue",
  queueSize: number
): void {
  telemetryState = {
    ...telemetryState,
    lastQueueSize: queueSize,
    events: appendEvent({
      type: "sync_skipped",
      reason,
      queueSize,
      timestamp: now()
    })
  };
}

export function recordMutationRetried(
  mutationType: PendingMutation["type"]
): void {
  telemetryState = {
    ...telemetryState,
    retries: telemetryState.retries + 1,
    events: appendEvent({
      type: "mutation_retried",
      mutationType,
      timestamp: now()
    })
  };
}

export function recordMutationDropped(
  mutationType: PendingMutation["type"],
  reason: string
): void {
  telemetryState = {
    ...telemetryState,
    droppedMutations: telemetryState.droppedMutations + 1,
    events: appendEvent({
      type: "mutation_dropped",
      mutationType,
      reason,
      timestamp: now()
    })
  };
}

export function getOfflineTelemetrySnapshot(): OfflineTelemetryState {
  return {
    ...telemetryState,
    events: [...telemetryState.events]
  };
}

export function resetOfflineTelemetry(): void {
  telemetryState = createInitialState();
}

function createInitialState(): OfflineTelemetryState {
  return {
    syncRuns: 0,
    retries: 0,
    droppedMutations: 0,
    lastQueueSize: 0,
    events: []
  };
}

function appendEvent(event: OfflineTelemetryEvent): OfflineTelemetryEvent[] {
  return [...telemetryState.events, event].slice(-MAX_EVENTS);
}

function now(): string {
  return new Date().toISOString();
}
