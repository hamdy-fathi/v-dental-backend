import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionFourController } from "./section-four.controller";
import { SectionFour } from "./section-four.entity";
import { SectionFourService } from "./section-four.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionFour])],
  controllers: [SectionFourController],
  providers: [SectionFourService],
  exports: [SectionFourService],
})
export class SectionFourModule {}
