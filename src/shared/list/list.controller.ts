// list.controller.ts
import { Controller, Get, Param } from "@nestjs/common";
import { Roles } from "src/shared/decorators/roles.decorator";
import { ListService } from "./list.service";

@Controller("lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get("slug/:slug")
  @Roles(
    "CEO",
    "TECH_SUPPORT",
    "STORE_MANAGER",
    "SUPER_ADMIN",
    "INVENTORY_MANAGER",
    "CONTENT_MANAGER",
    "SYSTEM_ADMIN",
  )
  getListsBySlug(@Param("slug") slug: string) {
    return this.listService.getListsBySlug(slug);
  }
}
