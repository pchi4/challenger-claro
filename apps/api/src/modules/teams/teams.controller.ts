import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from "@nestjs/common";
import { ApiResponse } from "@/common/types/api-response";
import { createSuccessResponse } from "@/common/utils/response-envelope";
import { ZodValidationPipe } from "@/common/pipes/zod-validation.pipe";
import {
  CreateTeamSchema,
  ListTeamsQuerySchema,
  TeamIdParams,
  UpdateTeamSchema,
  createTeamSchema,
  listTeamsQuerySchema,
  teamIdParamSchema,
  updateTeamSchema
} from "@/modules/teams/schemas/team.schemas";
import { TeamsService } from "@/modules/teams/teams.service";
import { TeamEntity } from "@/modules/teams/types/team.types";

@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async list(
    @Query(new ZodValidationPipe(listTeamsQuerySchema))
    query: ListTeamsQuerySchema
  ): Promise<ApiResponse<TeamEntity[]>> {
    const result = await this.teamsService.list(query);

    return createSuccessResponse(result.teams, result.meta);
  }

  @Get(":id")
  async findById(
    @Param(new ZodValidationPipe(teamIdParamSchema)) params: TeamIdParams
  ): Promise<ApiResponse<TeamEntity>> {
    const team = await this.teamsService.findById(params.id);

    return createSuccessResponse(team);
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createTeamSchema)) body: CreateTeamSchema
  ): Promise<ApiResponse<TeamEntity>> {
    const team = await this.teamsService.create(body);

    return createSuccessResponse(team);
  }

  @Put(":id")
  async update(
    @Param(new ZodValidationPipe(teamIdParamSchema)) params: TeamIdParams,
    @Body(new ZodValidationPipe(updateTeamSchema)) body: UpdateTeamSchema
  ): Promise<ApiResponse<TeamEntity>> {
    const team = await this.teamsService.update(params.id, body);

    return createSuccessResponse(team);
  }

  @Delete(":id")
  async delete(
    @Param(new ZodValidationPipe(teamIdParamSchema)) params: TeamIdParams
  ): Promise<ApiResponse<TeamEntity>> {
    const team = await this.teamsService.delete(params.id);

    return createSuccessResponse(team);
  }
}
