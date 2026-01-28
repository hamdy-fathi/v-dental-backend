import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionBranchesController } from "./section-branches.controller";
import { SectionBranches } from "./section-branches.entity";
import { SectionBranchesService } from "./section-branches.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionBranches])],
  controllers: [SectionBranchesController],
  providers: [SectionBranchesService],
  exports: [SectionBranchesService],
})
export class SectionBranchesModule {}
