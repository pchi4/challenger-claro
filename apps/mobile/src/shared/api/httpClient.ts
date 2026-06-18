import { API_URL } from "@/shared/constants/env";

export interface HttpClientOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: unknown
  ) {
    super(message);
    this.name = "HttpClientError";
  }
}

export async function httpClient<TResponse>(
  path: string,
  options: HttpClientOptions = {}
): Promise<TResponse> {
  const { body, headers, query, ...requestOptions } = options;
  const response = await fetch(buildUrl(path, query), {
    ...requestOptions,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new HttpClientError(response.statusText, response.status, payload);
  }

  return payload as TResponse;
}

function buildUrl(
  path: string,
  query?: HttpClientOptions["query"]
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_URL}${normalizedPath}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (text.length === 0) {
    return null;
  }

  return JSON.parse(text) as unknown;
}
