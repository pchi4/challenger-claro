import { randomUUID } from "crypto";
import { INestApplication } from "@nestjs/common";
import { Request, Response } from "express";
import { HttpMetricsService } from "@/common/services/http-metrics.service";
import { GlobalExceptionFilter } from "@/common/filters/global-exception.filter";
import { RequestLoggingInterceptor } from "@/common/interceptors/request-logging.interceptor";

interface RequestWithContext extends Request {
  requestId?: string;
}

export function setupApp(app: INestApplication): void {
  const httpMetricsService = app.get(HttpMetricsService);

  app.setGlobalPrefix("api");
  app.use((request: RequestWithContext, response: Response, next: () => void) => {
    const requestId = request.header("x-request-id") ?? randomUUID();

    request.requestId = requestId;
    response.setHeader("x-request-id", requestId);
    next();
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor(httpMetricsService));
}
