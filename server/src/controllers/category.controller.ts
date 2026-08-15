import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  static async create(req: Request, res: Response) {
    const { name } = req.body;
    const category = await CategoryService.create(name);
    res.status(201).json(category);
  }

  static async list(req: Request, res: Response) {
    const categories = await CategoryService.list();
    res.json(categories);
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;
    const result = await CategoryService.remove(Number(id));
    res.json(result);
  }
}
