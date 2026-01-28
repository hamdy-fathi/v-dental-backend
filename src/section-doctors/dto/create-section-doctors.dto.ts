import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { User } from "src/users/user.entity";

export class DoctorDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(200)
  short_description: string;

  @IsString()
  small_image: string;

  @IsString()
  @IsUrl()
  facebook: string;

  @IsString()
  @IsUrl()
  instagram: string;

  @IsString()
  image_main: string;
}

export class SectionDoctorsContentDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Title
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  // Description
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  // Doctors array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorDto)
  @IsOptional()
  doctors?: DoctorDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionDoctorsUpdateContentDto {
  // ID for updates
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Title
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title?: string;

  // Description
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  // Doctors array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorDto)
  @IsOptional()
  doctors?: DoctorDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionDoctorsDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDoctorsContentDto)
  content: SectionDoctorsContentDto[];

  createdBy: User;
}

export class UpdateSectionDoctorsDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDoctorsUpdateContentDto)
  content: SectionDoctorsUpdateContentDto[];

  createdBy: User;
}
