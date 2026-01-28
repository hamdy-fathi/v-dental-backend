import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
