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

export class SectionTwoContentDto {
  // Language ID
  @IsNumber()
  language_id: number;

  // Main headline
  @IsString()
  @IsOptional()
  @MaxLength(100)
  main_headline?: string;

  // Description text
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  // Main clinic image
  @IsString()
  @IsOptional()
  main_clinic_image?: string;

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionTwoUpdateContentDto {
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

  // Description text
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  // Main clinic image
  @IsString()
  @IsOptional()
  main_clinic_image?: string;

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionTwoDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionTwoContentDto)
  content: SectionTwoContentDto[];

  createdBy: User;
}

export class UpdateSectionTwoDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionTwoUpdateContentDto)
  content: SectionTwoUpdateContentDto[];

  createdBy: User;
}
