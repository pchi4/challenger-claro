import { Platform } from "react-native";

const defaultApiUrl =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";

export const API_URL = normalizeApiUrl(
  process.env.EXPO_PUBLIC_API_URL ?? defaultApiUrl
);

function normalizeApiUrl(url: string): string {
  if (Platform.OS !== "android") {
    return url;
  }

  return url
    .replace("://localhost", "://10.0.2.2")
    .replace("://127.0.0.1", "://10.0.2.2");
}
