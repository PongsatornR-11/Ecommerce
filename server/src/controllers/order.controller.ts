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

  static async getUserAddresses(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const addresses = await OrderService.getUserAddresses(req.user.id);
    res.json({ ok: true, addresses });
  }

  static async addAddress(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const { title, address, recipient, phone, isDefault } = req.body;
    if (!address || typeof address !== "string" || !address.trim()) {
      throw new AppError("Address is required", 400);
    }
    const created = await OrderService.addAddress(req.user.id, {
      title,
      address,
      recipient,
      phone,
      isDefault
    });
    res.json({ ok: true, message: "Address added successfully", address: created });
  }

  static async setDefaultAddress(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const addressId = parseInt(rawId, 10);
    if (isNaN(addressId)) throw new AppError("Invalid address ID", 400);
    const updated = await OrderService.setDefaultAddress(req.user.id, addressId);
    res.json({ ok: true, message: "Default address updated", address: updated });
  }

  static async deleteAddress(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const addressId = parseInt(rawId, 10);
    if (isNaN(addressId)) throw new AppError("Invalid address ID", 400);
    await OrderService.deleteAddress(req.user.id, addressId);
    res.json({ ok: true, message: "Address deleted successfully" });
  }
}
