import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "src/categories/category.entity";
import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class SubCategoryDto {
  @IsNotEmpty()
  content: Array<{
    name: string;
    description: string;
    language_id: number;
  }>;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  categoryType: CategoryType;

  @IsOptional()
  @IsString()
  image?: string;

  createdBy: User;

  category: Category;
}
