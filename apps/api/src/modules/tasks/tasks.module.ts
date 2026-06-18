import { Module } from "@nestjs/common";
import { TasksController } from "@/modules/tasks/tasks.controller";
import { TasksRepository } from "@/modules/tasks/tasks.repository";
import { TasksService } from "@/modules/tasks/tasks.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService]
})
export class TasksModule {}
