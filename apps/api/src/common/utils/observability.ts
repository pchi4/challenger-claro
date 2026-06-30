export interface LogEntry {
  level: "info" | "error";
  message: string;
  [key: string]: unknown;
}

export function logInfo(message: string, context: Record<string, unknown>): void {
  writeLog({
    level: "info",
    message,
    ...context
  });
}

export function logError(
  message: string,
  context: Record<string, unknown>
): void {
  writeLog({
    level: "error",
    message,
    ...context
  });
}

function writeLog(entry: LogEntry): void {
  const payload = {
    timestamp: new Date().toISOString(),
    ...entry
  };

  const serialized = JSON.stringify(payload);

  if (entry.level === "error") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
}
