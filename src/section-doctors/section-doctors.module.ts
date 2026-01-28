import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionDoctorsController } from "./section-doctors.controller";
import { SectionDoctors } from "./section-doctors.entity";
import { SectionDoctorsService } from "./section-doctors.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionDoctors])],
  controllers: [SectionDoctorsController],
  providers: [SectionDoctorsService],
  exports: [SectionDoctorsService],
})
export class SectionDoctorsModule {}
