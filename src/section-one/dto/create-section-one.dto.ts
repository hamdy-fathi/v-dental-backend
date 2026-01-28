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

export class AvailableDoctorDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(200)
  short_description: string;

  @IsString()
  image: string;
}

export class SectionOneContentDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Main headline
  @IsString()
  @IsOptional()
  @MaxLength(100)
  main_headline?: string;

  // Sub headline
  @IsString()
  @IsOptional()
  @MaxLength(200)
  sub_headline?: string;

  // Doctor count text
  @IsString()
  @IsOptional()
  @MaxLength(100)
  doctor_count_text?: string;

  // Available doctors array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableDoctorDto)
  @IsOptional()
  available_doctors_images?: AvailableDoctorDto[];

  // Talk doctors images array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  talk_doctors_images?: string[];

  // Main clinic image
  @IsString()
  @IsOptional()
  main_clinic_image?: string;

  // Additional clinic images array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additional_clinic_images?: string[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionOneUpdateContentDto {
  // ID for updates
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;

  // Language ID
  @IsNumber()
  @Type(() => Number)
  language_id: number;

  // Main headline
  @IsString()
  @IsOptional()
  @MaxLength(100)
  main_headline?: string;

  // Sub headline
  @IsString()
  @IsOptional()
  @MaxLength(200)
  sub_headline?: string;

  // Doctor count text
  @IsString()
  @IsOptional()
  @MaxLength(100)
  doctor_count_text?: string;

  // Available doctors array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableDoctorDto)
  @IsOptional()
  available_doctors_images?: AvailableDoctorDto[];

  // Talk doctors images array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  talk_doctors_images?: string[];

  // Main clinic image
  @IsString()
  @IsOptional()
  main_clinic_image?: string;

  // Additional clinic images array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  additional_clinic_images?: string[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionOneDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOneContentDto)
  content: SectionOneContentDto[];

  createdBy: User;
}

export class UpdateSectionOneDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOneUpdateContentDto)
  content: SectionOneUpdateContentDto[];

  createdBy: User;
}
