import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from "class-validator";
import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";

export enum BlogSortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class BlogDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  order?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string | null;

  @IsNotEmpty()
  content: Array<{
    title: string;
    description: string;
    subTitle: string;
    shortDescription: string;
    metaTitle: string;
    metaDescription: string;
    language_id: number;
  }>;

  @IsNotEmpty()
  @IsString()
  postType: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featuredImages?: string[];

  @IsOptional()
  @IsString()
  thumb?: string;

  @IsOptional()
  @IsString()
  mediaType?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  views?: number;

  categories: Category[];

  createdBy: User;
}

export class BlogFilterDto {
  @IsString()
  @IsOptional()
  categorySlug?: string;

  @IsString()
  @IsOptional()
  postType?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isPublished?: boolean;

  @IsString()
  @IsOptional()
  mediaType?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  length?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  start?: number;

  @IsEnum(BlogSortOrder)
  @IsOptional()
  sort?: BlogSortOrder;

  @IsString()
  @IsOptional()
  sortBy?: string;
}
