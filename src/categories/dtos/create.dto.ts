import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CategoryDto {
  @IsNotEmpty()
  content: Array<{
    name: string;
    description: string;
    language_id: number;
  }>;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  categoryType: CategoryType;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsOptional()
  countryIds?: number[];

  createdBy: User;
}
