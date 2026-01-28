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

export class FeatureDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsString()
  image: string;
}

export class SectionFourContentDto {
  // Language ID
  @IsNumber()
  language_id: number;

  // Main headline
  @IsString()
  @IsOptional()
  @MaxLength(100)
  main_headline?: string;

  // Main description
  @IsString()
  @IsOptional()
  @MaxLength(500)
  main_description?: string;

  // Right section images (4 separate images)
  @IsString()
  @IsOptional()
  right_section_image_1?: string;

  @IsString()
  @IsOptional()
  right_section_image_2?: string;

  @IsString()
  @IsOptional()
  right_section_image_3?: string;

  @IsString()
  @IsOptional()
  right_section_image_4?: string;

  // Features array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  @IsOptional()
  features?: FeatureDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionFourUpdateContentDto {
  // ID for updates
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Main headline
  @IsString()
  @IsOptional()
  @MaxLength(100)
  main_headline?: string;

  // Main description
  @IsString()
  @IsOptional()
  @MaxLength(500)
  main_description?: string;

  // Right section images (4 separate images)
  @IsString()
  @IsOptional()
  right_section_image_1?: string;

  @IsString()
  @IsOptional()
  right_section_image_2?: string;

  @IsString()
  @IsOptional()
  right_section_image_3?: string;

  @IsString()
  @IsOptional()
  right_section_image_4?: string;

  // Features array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  @IsOptional()
  features?: FeatureDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionFourDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionFourContentDto)
  content: SectionFourContentDto[];

  createdBy: User;
}

export class UpdateSectionFourDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionFourUpdateContentDto)
  content: SectionFourUpdateContentDto[];

  createdBy: User;
}
