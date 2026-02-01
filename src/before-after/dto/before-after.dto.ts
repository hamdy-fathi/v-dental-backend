import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateBeforeAfterDto {
  @IsString()
  @MaxLength(255)
  before: string;

  @IsString()
  @MaxLength(255)
  after: string;

  @IsString()
  @MaxLength(255)
  description: string;
}

export class UpdateBeforeAfterDto extends CreateBeforeAfterDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

