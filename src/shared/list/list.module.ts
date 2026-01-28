// list.module.ts
import { Module } from "@nestjs/common";
import { CategoryModule } from "src/categories/category.module";
import { ListController } from "./list.controller";
import { ListService } from "./list.service";

@Module({
  imports: [CategoryModule],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}
