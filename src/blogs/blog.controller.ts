import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, Req } from "@nestjs/common";
import { BaseController } from "src/shared/base/base.controller";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Blog } from "./blog.entity";
import { BlogsService } from "./blog.service";
import { BlogDto, BlogFilterDto } from "./dtos/create.dto";
import { PatchBlogDto } from "./dtos/patch.dto";

@Controller("blog")
export class BlogController
  extends BaseController<Blog, BlogDto, PatchBlogDto>
  implements SelectOptions, RelationOptions
{
  constructor(protected readonly service: BlogsService) {
    super(service);
  }

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      created_at: true,
      updated_at: true,
      content: true,
      postType: true,
      slug: true,
      startDate: true,
      endDate: true,
      featuredImages: true,
      thumb: true,
      video: true,
      mediaType: true,
      isFeatured: true,
      isPublished: true,
      order: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
      categories: {
        id: true,
        content: true,
      },
    };
  }

  @Post("/store")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public create(@Body() createDto: BlogDto, @Req() req: Request) {
    return this.service.create(
      {
        order: createDto.order,
        isFeatured: createDto.isFeatured,
        isPublished: createDto.isPublished,
        content: createDto.content,
        postType: createDto.postType,
        slug: createDto.slug,
        startDate: createDto.startDate,
        endDate: createDto.endDate,
        featuredImages: createDto.featuredImages,
        thumb: createDto.thumb,
        video: createDto.video,
        mediaType: createDto.mediaType,
        categories: req["categories"],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async update(@Body() update: PatchBlogDto, @Req() req: Request) {
    return await this.service.updateBlog(
      {
        id: update.id,
        order: update.order,
        isFeatured: update.isFeatured,
        isPublished: update.isPublished,
        content: update.content,
        postType: update.postType,
        slug: update.slug,
        startDate: update.startDate,
        endDate: update.endDate,
        featuredImages: update.featuredImages,
        thumb: update.thumb,
        mediaType: update.mediaType,
        video: update.video,
        blog: req["blog"],
        categories: req["categories"],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Patch("/change-published-status")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async changePublishedStatus(@Body() data: { id: number; isPublished: boolean }) {
    return await this.service.update({
      id: data.id,
      isPublished: data.isPublished,
    });
  }

  @Patch("/change-featured-status")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async changeFeaturedStatus(@Body() data: { id: number; isFeatured: boolean }) {
    return await this.service.update({
      id: data.id,
      isFeatured: data.isFeatured,
    });
  }

  @Post("/filter")
  @HttpCode(200)
  @Auth(AuthType.None)
  async filterBlogs(@Body() filterDto: BlogFilterDto) {
    return this.service.filterBlogs(filterDto);
  }

  @Get("/by-slug/:slug")
  @Auth(AuthType.None)
  public async getBlogBySlugWithRelated(@Param("slug") slug: string) {
    return await this.service.getBlogBySlugWithRelated(slug);
  }

  @Get("/increment-views/:slug")
  @HttpCode(200)
  @Auth(AuthType.None)
  public async incrementViews(@Param("slug") slug: string) {
    return await this.service.incrementViews(slug);
  }
}
