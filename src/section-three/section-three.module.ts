import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionThreeController } from "./section-three.controller";
import { SectionThree } from "./section-three.entity";
import { SectionThreeService } from "./section-three.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionThree])],
  controllers: [SectionThreeController],
  providers: [SectionThreeService],
  exports: [SectionThreeService],
})
export class SectionThreeModule {}
