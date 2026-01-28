import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionTwoController } from "./section-two.controller";
import { SectionTwo } from "./section-two.entity";
import { SectionTwoService } from "./section-two.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionTwo])],
  controllers: [SectionTwoController],
  providers: [SectionTwoService],
  exports: [SectionTwoService],
})
export class SectionTwoModule {}
