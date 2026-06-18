import { Injectable } from "@nestjs/common";
import { Prisma, Team } from "@prisma/client";
import { PrismaService } from "@/modules/prisma/prisma.service";
import {
  CreateTeamInput,
  ListTeamsQuery,
  UpdateTeamInput
} from "@/modules/teams/types/team.types";

@Injectable()
export class TeamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: ListTeamsQuery): Promise<Team[]> {
    return this.prisma.team.findMany({
      where: this.buildWhere(query.search),
      orderBy: {
        createdAt: "desc"
      },
      take: query.limit,
      skip: query.offset
    });
  }

  async count(query: Pick<ListTeamsQuery, "search">): Promise<number> {
    return this.prisma.team.count({
      where: this.buildWhere(query.search)
    });
  }

  async findById(id: string): Promise<Team | null> {
    return this.prisma.team.findUnique({
      where: { id }
    });
  }

  async create(data: CreateTeamInput): Promise<Team> {
    return this.prisma.team.create({
      data
    });
  }

  async update(id: string, data: UpdateTeamInput): Promise<Team> {
    return this.prisma.team.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<Team> {
    return this.prisma.team.delete({
      where: { id }
    });
  }

  private buildWhere(search?: string): Prisma.TeamWhereInput | undefined {
    if (search === undefined) {
      return undefined;
    }

    return {
      OR: [
        {
          name: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ]
    };
  }
}
