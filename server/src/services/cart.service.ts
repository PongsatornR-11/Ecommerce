import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export interface CartItemInput {
  id: number;
  count: number;
  price?: number;
}

export class CartService {
  static async saveUserCart(userId: number, items: CartItemInput[]) {
    if (items.length === 0) {
      throw new AppError("Cart cannot be empty", 400);
    }

    const productIds = items.map((i) => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate existence & stock, compute verified server total
    let cartTotal = 0;
    const validatedProducts: Array<{ productId: number; count: number; price: number }> = [];

    for (const item of items) {
      const product = productMap.get(item.id);
      if (!product) {
        throw new AppError(`Product #${item.id} no longer exists`, 400);
      }

      if (item.count > product.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.title}". Requested: ${item.count}, Available: ${product.quantity}`,
          400
        );
      }

      const itemTotal = product.price * item.count;
      cartTotal += itemTotal;

      validatedProducts.push({
        productId: product.id,
        count: item.count,
        price: product.price, // Use verified DB price
      });
    }

    // Atomic cart replacement
    return prisma.$transaction(async (tx) => {
      // Find existing cart
      const existingCart = await tx.cart.findUnique({
        where: { orderedById: userId },
      });

      if (existingCart) {
        await tx.productOnCart.deleteMany({
          where: { cartId: existingCart.id },
        });

        await tx.cart.delete({
          where: { id: existingCart.id },
        });
      }

      const newCart = await tx.cart.create({
        data: {
          orderedById: userId,
          cartTotal: parseFloat(cartTotal.toFixed(2)),
          products: {
            create: validatedProducts,
          },
        },
        include: {
          products: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      });

      return newCart;
    });
  }

  static async getUserCart(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { orderedById: userId },
      include: {
        products: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return {
        products: [],
        cartTotal: 0,
      };
    }

    return {
      products: cart.products,
      cartTotal: cart.cartTotal,
    };
  }

  static async emptyCart(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { orderedById: userId },
    });

    if (!cart) {
      return { message: "No active cart found" };
    }

    await prisma.$transaction([
      prisma.productOnCart.deleteMany({ where: { cartId: cart.id } }),
      prisma.cart.delete({ where: { id: cart.id } }),
    ]);

    return { message: "Cart emptied successfully" };
  }
}
