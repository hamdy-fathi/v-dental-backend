import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { ContactDto } from "./create.dto";

export class PatchContactDto extends PartialType(ContactDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
