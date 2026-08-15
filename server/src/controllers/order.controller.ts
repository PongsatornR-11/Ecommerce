import { Response } from "express";
import { OrderService } from "../services/order.service";
import { StripeService } from "../services/stripe.service";
import { AuthenticatedRequest } from "../middlewares/authCheck";
import { AppError } from "../utils/AppError";

export class OrderController {
  static async getUserOrders(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const orders = await OrderService.getUserOrders(req.user.id);
    res.json({ ok: true, orders });
  }

  static async saveOrder(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { paymentIntent } = req.body;
    if (!paymentIntent?.id) {
      throw new AppError("Payment Intent data is required", 400);
    }
    const order = await StripeService.confirmOrderManually(req.user.id, paymentIntent.id);
    res.json({ ok: true, order });
  }

  static async saveAddress(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user = await OrderService.saveAddress(req.user.id, req.body.address);
    res.json({ ok: true, message: "Address updated successfully", addressUpdate: user.address });
  }
}
