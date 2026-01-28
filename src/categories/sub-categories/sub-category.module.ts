import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { CategoryModule } from "../category.module";
import { CategoryMiddleware } from "./middleware/category.middleware";
import { SubCategoryController } from "./sub-category.controller";
import { SubCategory } from "./sub-category.entity";
import { SubCategoryService } from "./sub-category.service";
@Module({
  imports: [FilterDateModule, CategoryModule, TypeOrmModule.forFeature([SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CategoryMiddleware).forRoutes("sub-category/store", "sub-category/update");
  }
}
