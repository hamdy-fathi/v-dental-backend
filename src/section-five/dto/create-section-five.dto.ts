import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { User } from "src/users/user.entity";

export class SectionFiveContentDto {
  // Language ID
  @IsNumber()
  language_id: number;

  // Doctor image
  @IsString()
  @IsOptional()
  doctor_image?: string;

  // About Services array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  about_services?: string[];

  // Experience years count
  @IsString()
  @IsOptional()
  @MaxLength(50)
  experience_years?: string;

  // Title
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  // Short description
  @IsString()
  @IsOptional()
  @MaxLength(200)
  short_description?: string;

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionFiveUpdateContentDto {
  // ID for updates
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Doctor image
  @IsString()
  @IsOptional()
  doctor_image?: string;

  // About Services array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  about_services?: string[];

  // Experience years count
  @IsString()
  @IsOptional()
  @MaxLength(50)
  experience_years?: string;

  // Title
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  // Short description
  @IsString()
  @IsOptional()
  @MaxLength(200)
  short_description?: string;

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionFiveDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionFiveContentDto)
  content: SectionFiveContentDto[];

  createdBy: User;
}

export class UpdateSectionFiveDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionFiveUpdateContentDto)
  content: SectionFiveUpdateContentDto[];

  createdBy: User;
}
