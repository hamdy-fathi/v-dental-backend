import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { BlogDto } from "./create.dto";

export class PatchBlogDto extends PartialType(BlogDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
