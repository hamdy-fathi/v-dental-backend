import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}
