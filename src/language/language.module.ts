import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { LanguageController } from "./language.controller";
import { Language } from "./language.entity";
import { LanguageService } from "./language.service";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguageController],
  providers: [LanguageService, APIFeaturesService],
  exports: [LanguageService],
})
export class LanguageModule {}
