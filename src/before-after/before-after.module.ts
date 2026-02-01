import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BeforeAfterController } from "./before-after.controller";
import { BeforeAfter } from "./before-after.entity";
import { BeforeAfterService } from "./before-after.service";

@Module({
  imports: [TypeOrmModule.forFeature([BeforeAfter])],
  controllers: [BeforeAfterController],
  providers: [BeforeAfterService],
})
export class BeforeAfterModule {}

