import { Injectable } from "@nestjs/common";

interface RouteMetric {
  method: string;
  path: string;
  statusCode: number;
  count: number;
  totalDurationMs: number;
  maxDurationMs: number;
}

@Injectable()
export class HttpMetricsService {
  private readonly startedAt = Date.now();
  private totalRequests = 0;
  private totalErrors = 0;
  private readonly routeMetrics = new Map<string, RouteMetric>();

  recordRequest(input: {
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
  }): void {
    this.totalRequests += 1;

    if (input.statusCode >= 400) {
      this.totalErrors += 1;
    }

    const key = [input.method, input.path, input.statusCode].join(":");
    const current = this.routeMetrics.get(key);

    if (current === undefined) {
      this.routeMetrics.set(key, {
        method: input.method,
        path: input.path,
        statusCode: input.statusCode,
        count: 1,
        totalDurationMs: input.durationMs,
        maxDurationMs: input.durationMs
      });
      return;
    }

    current.count += 1;
    current.totalDurationMs += input.durationMs;
    current.maxDurationMs = Math.max(current.maxDurationMs, input.durationMs);
  }

  getSnapshot(): {
    uptimeSeconds: number;
    totals: {
      requests: number;
      errors: number;
    };
    routes: Array<
      RouteMetric & {
        avgDurationMs: number;
      }
    >;
  } {
    return {
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      totals: {
        requests: this.totalRequests,
        errors: this.totalErrors
      },
      routes: Array.from(this.routeMetrics.values())
        .map((metric) => ({
          ...metric,
          avgDurationMs:
            metric.count === 0 ? 0 : Number((metric.totalDurationMs / metric.count).toFixed(2))
        }))
        .sort((left, right) => right.count - left.count)
    };
  }
}
