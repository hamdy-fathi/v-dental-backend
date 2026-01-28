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

export class SectionThreeContentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

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

  // Services images array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services_images?: string[];

  // Service before image
  @IsString()
  @IsOptional()
  service_image_before?: string;

  // Service after image
  @IsString()
  @IsOptional()
  service_image_after?: string;

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionThreeUpdateContentDto {
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

  // Services images array
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services_images?: string[];

  // Service before image
  @IsString()
  @IsOptional()
  service_image_before?: string;

  // Service after image
  @IsString()
  @IsOptional()
  service_image_after?: string;

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionThreeDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionThreeContentDto)
  content: SectionThreeContentDto[];

  createdBy: User;
}

export class UpdateSectionThreeDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionThreeUpdateContentDto)
  content: SectionThreeUpdateContentDto[];

  createdBy: User;
}
