import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { ApiResponse } from "@/common/types/api-response";
import { createSuccessResponse } from "@/common/utils/response-envelope";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
  CreateTaskSchema,
  ListTasksQuerySchema,
  TaskIdParams,
  UpdateTaskSchema,
  UpdateTaskStatusSchema,
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
  updateTaskStatusSchema
} from "@/modules/tasks/schemas/task.schemas";
import { TasksService } from "@/modules/tasks/tasks.service";
import { TaskWithTeams } from "@/modules/tasks/types/task.types";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async list(
    @Query(new ZodValidationPipe(listTasksQuerySchema))
    query: ListTasksQuerySchema
  ): Promise<ApiResponse<TaskWithTeams[]>> {
    const result = await this.tasksService.list(query);

    return createSuccessResponse(result.tasks, result.meta);
  }

  @Get(":id")
  async findById(
    @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParams
  ): Promise<ApiResponse<TaskWithTeams>> {
    const task = await this.tasksService.findById(params.id);

    return createSuccessResponse(task);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createTaskSchema)) body: CreateTaskSchema
  ): Promise<ApiResponse<TaskWithTeams>> {
    const task = await this.tasksService.create(body);

    return createSuccessResponse(task);
  }

  @Put(":id")
  async update(
    @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParams,
    @Body(new ZodValidationPipe(updateTaskSchema)) body: UpdateTaskSchema
  ): Promise<ApiResponse<TaskWithTeams>> {
    const task = await this.tasksService.update(params.id, body);

    return createSuccessResponse(task);
  }

  @Delete(":id")
  async delete(
    @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParams
  ): Promise<ApiResponse<null>> {
    await this.tasksService.delete(params.id);

    return createSuccessResponse(null);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param(new ZodValidationPipe(taskIdParamSchema)) params: TaskIdParams,
    @Body(new ZodValidationPipe(updateTaskStatusSchema))
    body: UpdateTaskStatusSchema
  ): Promise<ApiResponse<TaskWithTeams>> {
    const task = await this.tasksService.updateStatus(params.id, body);

    return createSuccessResponse(task);
  }
}
