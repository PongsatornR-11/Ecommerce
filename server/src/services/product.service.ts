import prisma from "../config/prisma";
import cloudinary from "../config/cloudinary";
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

    // Clean up images in Cloudinary
    if (product.images.length > 0) {
      const deletePromises = product.images.map((img) =>
        cloudinary.uploader.destroy(img.public_id).catch((err) => {
          console.error(`Failed to delete image ${img.public_id} from Cloudinary:`, err);
        })
      );
      await Promise.all(deletePromises);
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
    return cloudinary.uploader.upload(base64Image, {
      public_id: `prod_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      resource_type: "auto",
      folder: "Ecommerce",
    });
  }

  static async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
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
