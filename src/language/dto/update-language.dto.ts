import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateLanguageDto } from "./create-language.dto";

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
