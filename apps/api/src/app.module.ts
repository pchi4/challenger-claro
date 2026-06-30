import { Module } from "@nestjs/common";
import { ObservabilityModule } from "@/modules/observability/observability.module";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { TasksModule } from "@/modules/tasks/tasks.module";
import { TeamsModule } from "@/modules/teams/teams.module";

@Module({
  imports: [PrismaModule, ObservabilityModule, TeamsModule, TasksModule]
})
export class AppModule {}
