import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { Role, UserStatus } from "src/shared/enum/global-enum";
import { User } from "../user.entity";
import { Match } from "./custom/match-password";

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  lastName?: string;

  @IsString()
  birthOfDate?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  username: string;

  @IsEnum(UserStatus, { message: "Type must be either customer or user" })
  type: UserStatus;

  @ValidateIf(o => o.type !== UserStatus.CUSTOMER)
  @IsEnum(Role, {
    message:
      "Role must be one of: general-manager, operation-manager, community-officer, accountant",
  })
  role?: Role;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: "Minimum eight characters, at least one letter, one number and one special character",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: "Minimum eight characters, at least one letter, one number and one special character",
  })
  @Match("password", { message: "Password confirmation must match password" })
  password_confirmation: string;

  createdBy: User;
}
