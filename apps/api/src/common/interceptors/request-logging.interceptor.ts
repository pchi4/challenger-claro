import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Request, Response } from "express";
import { finalize, Observable } from "rxjs";
import { HttpMetricsService } from "@/common/services/http-metrics.service";
import { logInfo } from "@/common/utils/observability";

interface RequestWithContext extends Request {
  requestId?: string;
}

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly httpMetricsService: HttpMetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithContext>();
    const response = http.getResponse<Response>();

    return next.handle().pipe(
      finalize(() => {
        const durationMs = Date.now() - startedAt;

        this.httpMetricsService.recordRequest({
          method: request.method,
          path: request.originalUrl ?? request.url,
          statusCode: response.statusCode,
          durationMs
        });

        logInfo("HTTP request completed", {
          requestId: request.requestId ?? null,
          method: request.method,
          path: request.originalUrl ?? request.url,
          statusCode: response.statusCode,
          durationMs,
          userAgent: request.get("user-agent") ?? null
        });
      })
    );
  }
}
