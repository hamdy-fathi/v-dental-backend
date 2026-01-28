import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CategoryService } from "src/categories/category.service";

@Injectable()
export class CategoryMiddleware implements NestMiddleware {
  constructor(private readonly categoryService: CategoryService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { categoryId } = req.body;
    req["category"] = await this.getCategory(categoryId);
    next();
  }

  private async getCategory(categoryId?: number) {
    if (!categoryId) return null;
    const category = await this.categoryService.findOne(categoryId);
    return category;
  }
}
