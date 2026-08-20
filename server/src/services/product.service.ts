import fs from "fs";
import path from "path";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  quantity: number;
  categoryId?: number | null;
  images?: Array<{
    asset_id: string;
    public_id: string;
    url: string;
    secure_url: string;
  }>;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
  categoryId?: number | null;
  images?: Array<{
    asset_id: string;
    public_id: string;
    url: string;
    secure_url: string;
  }>;
}

export interface SearchFilterInput {
  query?: string;
  category?: number[];
  price?: [number, number];
}

export class ProductService {
  static async create(input: CreateProductInput) {
    const { title, description, price, quantity, categoryId, images } = input;

    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        throw new AppError("Specified category does not exist", 400);
      }
    }

    return prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        categoryId: categoryId || null,
        images: images && images.length > 0
          ? {
              create: images.map((img) => ({
                asset_id: img.asset_id,
                public_id: img.public_id,
                url: img.url,
                secure_url: img.secure_url,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async list(count?: number) {
    return prisma.product.findMany({
      take: count ? count : 100,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async getById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      throw new AppError(`Product #${id} not found`, 404);
    }

    return product;
  }

  static async update(id: number, input: UpdateProductInput) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new AppError(`Product #${id} not found`, 404);
    }

    if (input.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!categoryExists) {
        throw new AppError("Specified category does not exist", 400);
      }
    }

    // If new images provided, clean up old images from DB
    if (input.images !== undefined) {
      await prisma.image.deleteMany({
        where: { productId: id },
      });
    }

    return prisma.product.update({
      where: { id },
      data: {
        title: input.title ?? product.title,
        description: input.description ?? product.description,
        price: input.price !== undefined ? input.price : product.price,
        quantity: input.quantity !== undefined ? input.quantity : product.quantity,
        categoryId: input.categoryId !== undefined ? input.categoryId : product.categoryId,
        images: input.images && input.images.length > 0
          ? {
              create: input.images.map((img) => ({
                asset_id: img.asset_id,
                public_id: img.public_id,
                url: img.url,
                secure_url: img.secure_url,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async remove(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      throw new AppError(`Product #${id} not found`, 404);
    }

    // Clean up images from local disk storage
    if (product.images.length > 0) {
      for (const img of product.images) {
        try {
          const fileName = path.basename(img.url);
          const filePath = path.join(__dirname, "../../uploads", fileName);
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }
        } catch (err) {
          console.error(`Failed to delete local image ${img.url}:`, err);
        }
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: `Deleted ${product.title} successfully` };
  }

  static async listBy(sort: string = "createdAt", order: "asc" | "desc" = "desc", limit: number = 10) {
    const validSortFields = ["createdAt", "price", "sold", "title", "quantity"];
    const sortField = validSortFields.includes(sort) ? sort : "createdAt";

    return prisma.product.findMany({
      take: Math.min(limit, 100),
      orderBy: { [sortField]: order },
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async searchFilters(filters: SearchFilterInput) {
    const { query, category, price } = filters;
    const where: any = {};

    if (query && query.trim().length > 0) {
      where.OR = [
        { title: { contains: query.trim() } },
        { description: { contains: query.trim() } },
      ];
    }

    if (category && category.length > 0) {
      where.categoryId = {
        in: category,
      };
    }

    if (price && price.length === 2) {
      where.price = {
        gte: price[0],
        lte: price[1],
      };
    }

    return prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async uploadImage(base64Image: string) {
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadsDir)) {
      await fs.promises.mkdir(uploadsDir, { recursive: true });
    }

    // Extract mime type & base64 data
    const matches = base64Image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    let ext = "jpg";
    let base64Data = base64Image;

    if (matches && matches.length === 3) {
      ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      base64Data = matches[2];
    }

    const publicId = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const fileName = `${publicId}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    const buffer = Buffer.from(base64Data, "base64");
    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return {
      public_id: publicId,
      asset_id: publicId,
      url: fileUrl,
      secure_url: fileUrl,
    };
  }

  static async deleteImage(publicId: string) {
    const uploadsDir = path.join(__dirname, "../../uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = await fs.promises.readdir(uploadsDir);
      const targetFile = files.find((f) => f.startsWith(publicId));
      if (targetFile) {
        await fs.promises.unlink(path.join(uploadsDir, targetFile));
      }
    }
    return { result: "ok" };
  }

  static async getReviews(productId: number) {
    return prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  static async createReview(userId: number, productId: number, rating: number, comment: string) {
    const productExists = await prisma.product.findUnique({ where: { id: productId } });
    if (!productExists) {
      throw new AppError(`Product #${productId} not found`, 404);
    }

    return prisma.review.create({
      data: {
        userId,
        productId,
        rating: Math.max(1, Math.min(5, rating)),
        comment
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  }
}
