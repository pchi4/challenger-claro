import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { HttpMetricsService } from "@/common/services/http-metrics.service";
import { createSuccessResponse } from "@/common/utils/response-envelope";
import { ApiResponse } from "@/common/types/api-response";

interface HealthPayload {
  status: "ok";
  timestamp: string;
  uptimeSeconds: number;
  database: {
    status: "ok";
  };
}

@Controller()
export class ObservabilityController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpMetricsService: HttpMetricsService
  ) {}

  @Get("health")
  async health(): Promise<ApiResponse<HealthPayload>> {
    await this.prisma.healthcheck();

    const metrics = this.httpMetricsService.getSnapshot();

    return createSuccessResponse({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: metrics.uptimeSeconds,
      database: {
        status: "ok"
      }
    });
  }

  @Get("metrics")
  metrics(): ApiResponse<ReturnType<HttpMetricsService["getSnapshot"]>> {
    return createSuccessResponse(this.httpMetricsService.getSnapshot());
  }
}
