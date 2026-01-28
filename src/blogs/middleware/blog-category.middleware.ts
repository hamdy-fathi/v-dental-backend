import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CategoryService } from "src/categories/category.service";
import { BlogsService } from "../blog.service";

@Injectable()
export class BlogCategoryMiddleware implements NestMiddleware {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly blogService: BlogsService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { categoryIds, id } = req.body;
    const method = req.method;

    if (categoryIds && Array.isArray(categoryIds)) {
      try {
        const categories = await this.categoryService.findByIds(categoryIds);
        req["categories"] = categories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        req["categories"] = [];
      }
    }

    if (method === "PUT") {
      const blog = await this.blogService.findOne(id);
      if (!blog) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      req["blog"] = blog;
    }

    next();
  }
}
