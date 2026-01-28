import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CategoryDto } from "./create.dto";

export class PatchCategoryDto extends PartialType(CategoryDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
