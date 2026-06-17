import {
  ApiErrorResponse,
  ApiResponse,
  PaginationMeta
} from "../types/api-response";

export function createSuccessResponse<T>(
  data: T,
  meta?: PaginationMeta
): ApiResponse<T> {
  return meta === undefined ? { data } : { data, meta };
}

export function createErrorResponse(
  error: ApiErrorResponse["error"]
): ApiErrorResponse {
  return { error };
}
