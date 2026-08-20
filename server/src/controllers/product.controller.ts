import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  static async create(req: Request, res: Response) {
    const product = await ProductService.create(req.body);
    res.status(201).json(product);
  }

  static async list(req: Request, res: Response) {
    const countParam = req.params.count;
    const count = typeof countParam === "string" ? parseInt(countParam, 10) : undefined;
    const products = await ProductService.list(count);
    res.json(products);
  }

  static async read(req: Request, res: Response) {
    const { id } = req.params;
    const product = await ProductService.getById(Number(id));
    res.json(product);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const product = await ProductService.update(Number(id), req.body);
    res.json(product);
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;
    const result = await ProductService.remove(Number(id));
    res.json(result);
  }

  static async listBy(req: Request, res: Response) {
    const { sort = "createdAt", order = "desc", limit = 10 } = req.body;
    const products = await ProductService.listBy(sort, order, Number(limit));
    res.json(products);
  }

  static async searchFilters(req: Request, res: Response) {
    const products = await ProductService.searchFilters(req.body);
    res.json(products);
  }

  static async createImage(req: Request, res: Response) {
    const result = await ProductService.uploadImage(req.body.image);
    res.json(result);
  }

  static async removeImage(req: Request, res: Response) {
    const { public_id } = req.body;
    await ProductService.deleteImage(public_id);
    res.json({ message: "Image Removed" });
  }

  static async getReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);
    const reviews = await ProductService.getReviews(productId);
    res.json({ ok: true, reviews });
  }

  static async createReview(req: any, res: Response) {
    const productId = Number(req.params.id);
    const { rating, comment } = req.body;
    const review = await ProductService.createReview(req.user.id, productId, rating, comment);
    res.json({ ok: true, review });
  }
}
