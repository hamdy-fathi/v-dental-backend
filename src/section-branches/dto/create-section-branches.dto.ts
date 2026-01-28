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

export class BranchDto {
  @IsString()
  iframe: string;

  @IsString()
  @MaxLength(200)
  working_hours: string;

  @IsString()
  @MaxLength(300)
  address: string;
}

export class SectionBranchesContentDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  id: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Branches array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchDto)
  @IsOptional()
  branches?: BranchDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionBranchesUpdateContentDto {
  // ID for updates
  @IsNumber()
  id: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Branches array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BranchDto)
  @IsOptional()
  branches?: BranchDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionBranchesDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionBranchesContentDto)
  content: SectionBranchesContentDto[];

  createdBy: User;
}

export class UpdateSectionBranchesDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionBranchesUpdateContentDto)
  content: SectionBranchesUpdateContentDto[];

  createdBy: User;
}
