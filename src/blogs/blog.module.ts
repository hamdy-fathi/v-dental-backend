import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModule } from "src/categories/category.module";
import { Category } from "src/categories/category.entity";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { BlogController } from "./blog.controller";
import { Blog } from "./blog.entity";
import { BlogsService } from "./blog.service";
import { BlogCategoryMiddleware } from "./middleware/blog-category.middleware";

@Module({
  imports: [CategoryModule, FilterDateModule, TypeOrmModule.forFeature([Blog, Category])],
  controllers: [BlogController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BlogCategoryMiddleware).forRoutes("blog/store", "blog/update");
  }
}
