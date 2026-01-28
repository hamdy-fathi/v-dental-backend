import { IsOptional, IsString } from "class-validator";

export class FacebookOAuthCallbackDto {
  @IsString()
  facebookId: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  accessToken: string;
}
