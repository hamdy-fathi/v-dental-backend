import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { SubCategoryDto } from "./create.dto";

export class PatchSubCategoryDto extends PartialType(SubCategoryDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
