import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionOneController } from "./section-one.controller";
import { SectionOne } from "./section-one.entity";
import { SectionOneService } from "./section-one.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionOne])],
  controllers: [SectionOneController],
  providers: [SectionOneService],
  exports: [SectionOneService],
})
export class SectionOneModule {}
