import { IsOptional, IsString, MaxLength } from "class-validator";
import { User } from "src/users/user.entity";

export class CreateLanguageDto {
  // Language name
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  createdBy: User;
}
