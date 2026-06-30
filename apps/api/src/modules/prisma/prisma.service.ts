import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { logInfo } from "@/common/utils/observability";

const SLOW_QUERY_THRESHOLD_MS = 150;

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, "query">
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        {
          emit: "event",
          level: "query"
        }
      ]
    });

    this.$on("query", (event: Prisma.QueryEvent) => {
      if (event.duration < SLOW_QUERY_THRESHOLD_MS) {
        return;
      }

      logInfo("Slow database query detected", {
        durationMs: event.duration,
        query: event.query,
        params: event.params,
        target: event.target
      });
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async healthcheck(): Promise<void> {
    await this.$queryRaw`SELECT 1`;
  }
}
