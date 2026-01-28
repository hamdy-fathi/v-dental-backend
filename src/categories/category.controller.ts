import { Body, Controller, Get, Post, Put, Req } from "@nestjs/common";
import { BaseController } from "src/shared/base/base.controller";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, CategoryType } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./dtos/create.dto";
import { PatchCategoryDto } from "./dtos/patch.dto";

@Controller("category")
export class CategoryController
  extends BaseController<Category, CategoryDto, PatchCategoryDto>
  implements SelectOptions, RelationOptions
{
  constructor(protected readonly service: CategoryService) {
    super(service);
  }

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      created_at: true,
      updated_at: true,
      content: true,
      categoryType: true,
      image: true,
      slug: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/store")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async create(@Body() create: CategoryDto, @Req() req: Request) {
    const category = await this.service.create(
      {
        content: create.content,
        categoryType: create.categoryType,
        image: create.image,
        slug: create.slug,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );

    return category;
  }

  @Put("/update")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async update(@Body() update: PatchCategoryDto, @Req() req: Request) {
    const category = await this.service.update(
      {
        id: update.id,
        content: update.content,
        categoryType: update.categoryType,
        image: update.image,
        slug: update.slug,
        createdBy: req["updatedBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
    return category;
  }

  @Get("/blog")
  @Auth(AuthType.None)
  public async getBlogCategories() {
    return await this.service.findFront({
      query: {
        filters: { categoryType: CategoryType.BLOG },
        relations: {
          subCategories: {
            select: ["id", "name", "slug", "image", "description"],
          },
        },
        isPagination: "false",
      },
    });
  }

  @Get("/parent")
  @Auth(AuthType.None)
  public async getParentCategories() {
    return await this.service.getParentCategories();
  }
}
