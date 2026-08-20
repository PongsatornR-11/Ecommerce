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

    // Also sync to Address model as default
    const existingDefault = await prisma.address.findFirst({
      where: { userId, isDefault: true }
    });

    if (existingDefault) {
      await prisma.address.update({
        where: { id: existingDefault.id },
        data: { address }
      });
    } else {
      await prisma.address.create({
        data: {
          userId,
          title: "Home",
          address,
          isDefault: true
        }
      });
    }

    return user;
  }

  static async getUserAddresses(userId: number) {
    let addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    });

    // Fallback: If no Address model rows exist but User.address is set, migrate it
    if (addresses.length === 0) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { address: true, name: true } });
      if (user?.address) {
        const created = await prisma.address.create({
          data: {
            userId,
            title: "Home (Default)",
            recipient: user.name || "Default Contact",
            address: user.address,
            isDefault: true
          }
        });
        addresses = [created];
      }
    }

    return addresses;
  }

  static async addAddress(userId: number, data: { title?: string; address: string; recipient?: string; phone?: string; isDefault?: boolean }) {
    const existingCount = await prisma.address.count({ where: { userId } });
    const isFirst = existingCount === 0;
    const shouldBeDefault = isFirst || !!data.isDefault;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        title: data.title || "Shipping Address",
        recipient: data.recipient || null,
        phone: data.phone || null,
        address: data.address,
        isDefault: shouldBeDefault
      }
    });

    if (shouldBeDefault) {
      await prisma.user.update({
        where: { id: userId },
        data: { address: data.address }
      });
    }

    return newAddress;
  }

  static async setDefaultAddress(userId: number, addressId: number) {
    const addressRecord = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!addressRecord) {
      throw new AppError("Address not found", 404);
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    const updated = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { address: updated.address }
    });

    return updated;
  }

  static async deleteAddress(userId: number, addressId: number) {
    const addressRecord = await prisma.address.findFirst({
      where: { id: addressId, userId }
    });

    if (!addressRecord) {
      throw new AppError("Address not found", 404);
    }

    await prisma.address.delete({ where: { id: addressId } });

    if (addressRecord.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true }
        });
        await prisma.user.update({
          where: { id: userId },
          data: { address: nextAddress.address }
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { address: null }
        });
      }
    }

    return { ok: true };
  }
}
