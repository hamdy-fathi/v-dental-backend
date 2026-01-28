// list.service.ts
import { Injectable } from "@nestjs/common";
import { CategoryService } from "src/categories/category.service";
import {
  getArticleTypeList,
  getCategoryTypeList,
  getMediaTypeList,
  getRoleList,
} from "../utilties/get-flobal-list-from-enum.utils";

@Injectable()
export class ListService {
  constructor(private readonly categoryService: CategoryService) {}
  private lists = {
    roles: getRoleList(),
    mediaType: getMediaTypeList(),
    articleType: getArticleTypeList(),
    categoryType: getCategoryTypeList(),
  };

  async getListsBySlug(slug: string) {
    switch (slug) {
      case "user":
        return {
          roles: this.lists.roles,
        };
      case "blog":
        return {
          categories: await this.categoryService.getList(),
        };

      default:
        throw new Error(`Slug "${slug}" not supported`);
    }
  }
}
