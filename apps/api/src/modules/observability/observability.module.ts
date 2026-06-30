import { Module } from "@nestjs/common";
import { HttpMetricsService } from "@/common/services/http-metrics.service";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { ObservabilityController } from "@/modules/observability/observability.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ObservabilityController],
  providers: [HttpMetricsService],
  exports: [HttpMetricsService]
})
export class ObservabilityModule {}
