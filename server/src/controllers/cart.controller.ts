import { Response } from "express";
import { CartService } from "../services/cart.service";
import { AuthenticatedRequest } from "../middlewares/authCheck";
import { AppError } from "../utils/AppError";

export class CartController {
  static async userCart(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const result = await CartService.saveUserCart(req.user.id, req.body.cart);
    res.json({ ok: true, message: "Cart saved successfully", cart: result });
  }

  static async getUserCart(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const cart = await CartService.getUserCart(req.user.id);
    res.json(cart);
  }

  static async emptyCart(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const result = await CartService.emptyCart(req.user.id);
    res.json(result);
  }
}
