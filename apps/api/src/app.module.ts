import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { TeamsModule } from "./modules/teams/teams.module";

@Module({
  imports: [PrismaModule, TeamsModule, TasksModule]
})
export class AppModule {}
