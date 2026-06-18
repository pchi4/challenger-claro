import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { TasksRepository } from "@/modules/tasks/tasks.repository";
import {
  CreateTaskInput,
  ListTasksQuery,
  ListTasksResult,
  TaskWithTeams,
  UpdateTaskInput,
  UpdateTaskStatusInput
} from "@/modules/tasks/types/task.types";

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async list(query: ListTasksQuery): Promise<ListTasksResult> {
    const [tasks, total] = await Promise.all([
      this.tasksRepository.findMany(query),
      this.tasksRepository.count({
        teamId: query.teamId,
        status: query.status,
        search: query.search
      })
    ]);

    return {
      tasks,
      meta: {
        total,
        limit: query.limit,
        offset: query.offset
      }
    };
  }

  async findById(id: string): Promise<TaskWithTeams> {
    const task = await this.tasksRepository.findById(id);

    if (task === null) {
      throw new NotFoundException("Task not found");
    }

    return task;
  }

  async create(data: CreateTaskInput): Promise<TaskWithTeams> {
    await this.ensureTeamsExist(data.teamIds);

    return this.tasksRepository.create(this.normalizeTeamIds(data));
  }

  async update(id: string, data: UpdateTaskInput): Promise<TaskWithTeams> {
    await this.ensureTaskExists(id);
    await this.ensureTeamsExist(data.teamIds);

    return this.tasksRepository.update(id, this.normalizeTeamIds(data));
  }

  async updateStatus(
    id: string,
    data: UpdateTaskStatusInput
  ): Promise<TaskWithTeams> {
    await this.ensureTaskExists(id);

    return this.tasksRepository.updateStatus(id, data.status);
  }

  async delete(id: string): Promise<void> {
    await this.ensureTaskExists(id);
    await this.tasksRepository.delete(id);
  }

  private async ensureTaskExists(id: string): Promise<void> {
    await this.findById(id);
  }

  private async ensureTeamsExist(teamIds?: string[]): Promise<void> {
    if (teamIds === undefined || teamIds.length === 0) {
      return;
    }

    const uniqueTeamIds = [...new Set(teamIds)];
    const existingTeamsCount =
      await this.tasksRepository.countTeamsByIds(uniqueTeamIds);

    if (existingTeamsCount !== uniqueTeamIds.length) {
      throw new BadRequestException("One or more teams were not found");
    }
  }

  private normalizeTeamIds<T extends CreateTaskInput | UpdateTaskInput>(
    data: T
  ): T {
    if (data.teamIds === undefined) {
      return data;
    }

    return {
      ...data,
      teamIds: [...new Set(data.teamIds)]
    };
  }
}
