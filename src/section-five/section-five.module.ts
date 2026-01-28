import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionFiveController } from "./section-five.controller";
import { SectionFive } from "./section-five.entity";
import { SectionFiveService } from "./section-five.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionFive])],
  controllers: [SectionFiveController],
  providers: [SectionFiveService],
  exports: [SectionFiveService],
})
export class SectionFiveModule {}
