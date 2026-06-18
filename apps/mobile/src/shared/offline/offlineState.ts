import { createMMKV } from "react-native-mmkv";
import {
  defaultOfflineState,
  OfflineState,
  PendingMutation
} from "@/shared/offline/offline.types";

const storage = createMMKV({
  id: "claro-fullstack-offline"
});

const STATE_KEY = "offline-state";

export function readOfflineState(): OfflineState {
  const raw = storage.getString(STATE_KEY);

  if (raw === undefined) {
    return defaultOfflineState;
  }

  try {
    return {
      ...defaultOfflineState,
      ...(JSON.parse(raw) as Partial<OfflineState>)
    };
  } catch {
    return defaultOfflineState;
  }
}

export function writeOfflineState(
  updater: (state: OfflineState) => OfflineState
): OfflineState {
  const nextState = updater(readOfflineState());
  storage.set(STATE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function getPendingMutations(): PendingMutation[] {
  return readOfflineState().pendingMutations;
}

export function setPendingMutations(pendingMutations: PendingMutation[]): void {
  writeOfflineState((state) => ({
    ...state,
    pendingMutations
  }));
}

export function getResolvedId(id: string): string {
  return readOfflineState().idMappings[id] ?? id;
}
