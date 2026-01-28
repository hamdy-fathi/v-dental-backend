import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { User } from "src/users/user.entity";

export class ReviewDto {
  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MaxLength(50)
  rating_text: string;

  @IsString()
  @MaxLength(1000)
  review_text: string;

  @IsString()
  @MaxLength(100)
  reviewer_name: string;

  @IsString()
  @IsOptional()
  reviewer_image?: string;
}

export class SectionReviewsContentDto {
  // Language ID
  @IsNumber()
  language_id: number;

  // Reviews array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  @IsOptional()
  reviews?: ReviewDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class SectionReviewsUpdateContentDto {
  // ID for updates
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id: number;

  // Language ID
  @IsNumber()
  language_id: number;

  // Reviews array as JSONB
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  @IsOptional()
  reviews?: ReviewDto[];

  // Is active/visible
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class CreateSectionReviewsDto {
  // Content array for multiple languages
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionReviewsContentDto)
  content: SectionReviewsContentDto[];

  createdBy: User;
}

export class UpdateSectionReviewsDto {
  // Content array for multiple languages with IDs
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionReviewsUpdateContentDto)
  content: SectionReviewsUpdateContentDto[];

  createdBy: User;
}
