export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<TData> {
  data: TData;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
