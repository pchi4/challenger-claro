import { Module } from "@nestjs/common";
import { TeamsController } from "@/modules/teams/teams.controller";
import { TeamsRepository } from "@/modules/teams/teams.repository";
import { TeamsService } from "@/modules/teams/teams.service";

@Module({
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService]
})
export class TeamsModule {}
