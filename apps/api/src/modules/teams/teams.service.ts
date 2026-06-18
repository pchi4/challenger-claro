import { Injectable, NotFoundException } from "@nestjs/common";
import { TeamsRepository } from "@/modules/teams/teams.repository";
import {
  CreateTeamInput,
  ListTeamsQuery,
  ListTeamsResult,
  TeamEntity,
  UpdateTeamInput
} from "@/modules/teams/types/team.types";

@Injectable()
export class TeamsService {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async list(query: ListTeamsQuery): Promise<ListTeamsResult> {
    const [teams, total] = await Promise.all([
      this.teamsRepository.findMany(query),
      this.teamsRepository.count({ search: query.search })
    ]);

    return {
      teams,
      meta: {
        total,
        limit: query.limit,
        offset: query.offset
      }
    };
  }

  async findById(id: string): Promise<TeamEntity> {
    const team = await this.teamsRepository.findById(id);

    if (team === null) {
      throw new NotFoundException("Team not found");
    }

    return team;
  }

  async create(data: CreateTeamInput): Promise<TeamEntity> {
    return this.teamsRepository.create(data);
  }

  async update(id: string, data: UpdateTeamInput): Promise<TeamEntity> {
    await this.ensureTeamExists(id);
    return this.teamsRepository.update(id, data);
  }

  async delete(id: string): Promise<TeamEntity> {
    await this.ensureTeamExists(id);
    return this.teamsRepository.delete(id);
  }

  private async ensureTeamExists(id: string): Promise<void> {
    await this.findById(id);
  }
}
