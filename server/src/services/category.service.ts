import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export class CategoryService {
  static async create(name: string) {
    const trimmedName = name.trim();
    const existing = await prisma.category.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      throw new AppError("Category already exists", 400);
    }

    return prisma.category.create({
      data: { name: trimmedName },
    });
  }

  static async list() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async remove(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    if (category.products.length > 0) {
      throw new AppError(
        "Cannot delete category that still has associated products. Reassign or delete products first.",
        400
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return { message: "Category deleted successfully" };
  }
}
