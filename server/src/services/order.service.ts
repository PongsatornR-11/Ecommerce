import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export class OrderService {
  static async getUserOrders(userId: number) {
    return prisma.order.findMany({
      where: { orderedById: userId },
      include: {
        products: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllOrders() {
    return prisma.order.findMany({
      include: {
        orderedBy: {
          select: {
            id: true,
            email: true,
            name: true,
            address: true,
          },
        },
        products: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateOrderStatus(orderId: number, orderStatus: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError(`Order #${orderId} not found`, 404);
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
    });
  }

  static async saveAddress(userId: number, address: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { address },
      select: {
        id: true,
        email: true,
        address: true,
      },
    });

    return user;
  }
}
