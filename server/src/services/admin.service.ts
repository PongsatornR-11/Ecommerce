import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export class AdminService {
  static async listUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        enabled: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async changeUserStatus(id: number, enabled: boolean) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return prisma.user.update({
      where: { id },
      data: { enabled },
      select: {
        id: true,
        email: true,
        enabled: true,
      },
    });
  }

  static async changeUserRole(id: number, role: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }
}
