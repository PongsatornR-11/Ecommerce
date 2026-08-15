import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { OrderService } from "../services/order.service";

export class AdminController {
  static async listUsers(req: Request, res: Response) {
    const users = await AdminService.listUsers();
    res.json(users);
  }

  static async changeStatus(req: Request, res: Response) {
    const { id, enabled } = req.body;
    const user = await AdminService.changeUserStatus(Number(id), enabled);
    res.json({ message: "User status updated successfully", user });
  }

  static async changeRole(req: Request, res: Response) {
    const { id, role } = req.body;
    const user = await AdminService.changeUserRole(Number(id), role);
    res.json({ message: "User role updated successfully", user });
  }

  static async getOrders(req: Request, res: Response) {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  }

  static async changeOrderStatus(req: Request, res: Response) {
    const { orderId, orderStatus } = req.body;
    const order = await OrderService.updateOrderStatus(Number(orderId), orderStatus);
    res.json({ message: "Order status updated successfully", order });
  }
}
