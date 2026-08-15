import Stripe from "stripe";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-11-20.acacia" as any,
});

export class StripeService {
  static async createPaymentIntent(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { orderedById: userId },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.products.length === 0) {
      throw new AppError("Cart is empty or not found", 400);
    }

    // Verify stock availability
    for (const item of cart.products) {
      if (item.count > item.product.quantity) {
        throw new AppError(
          `Product "${item.product.title}" has only ${item.product.quantity} units left in stock.`,
          400
        );
      }
    }

    // Amount in THB satang (cents) -> integer
    const amountSatang = Math.round(cart.cartTotal * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountSatang,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId.toString(),
        cartId: cart.id.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: cart.cartTotal,
      currency: "thb",
    };
  }

  static constructWebhookEvent(payload: Buffer | string, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    if (!webhookSecret) {
      throw new AppError("Stripe webhook secret is not configured", 500);
    }
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
    }
  }

  static async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    const paymentId = paymentIntent.id;
    const userId = Number(paymentIntent.metadata.userId);

    if (!userId) {
      console.error(`Stripe Webhook Error: missing userId metadata on PaymentIntent ${paymentId}`);
      return;
    }

    // Idempotency check: Don't process twice
    const existingOrder = await prisma.order.findUnique({
      where: { stripePaymentId: paymentId },
    });

    if (existingOrder) {
      console.log(`Order for payment ${paymentId} already processed.`);
      return existingOrder;
    }

    // Fetch user cart
    const userCart = await prisma.cart.findUnique({
      where: { orderedById: userId },
      include: { products: { include: { product: true } } },
    });

    if (!userCart || userCart.products.length === 0) {
      console.error(`Cart for user ${userId} not found during webhook processing`);
      return;
    }

    const orderAmount = paymentIntent.amount / 100;

    return prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          orderedById: userId,
          cartTotal: userCart.cartTotal,
          stripePaymentId: paymentId,
          amount: Math.round(orderAmount),
          status: paymentIntent.status,
          currency: paymentIntent.currency,
          orderStatus: "Processing",
          products: {
            create: userCart.products.map((item) => ({
              productId: item.productId,
              count: item.count,
              price: item.price,
            })),
          },
        },
      });

      // 2. Decrement stock & increment sold
      for (const item of userCart.products) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { decrement: item.count },
            sold: { increment: item.count },
          },
        });
      }

      // 3. Delete cart items & cart
      await tx.productOnCart.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.delete({
        where: { id: userCart.id },
      });

      console.log(`Order #${order.id} created successfully via Stripe Webhook for payment ${paymentId}`);
      return order;
    });
  }

  // Fallback endpoint for client confirmation (also uses transaction & idempotency)
  static async confirmOrderManually(userId: number, paymentIntentId: string) {
    const existingOrder = await prisma.order.findUnique({
      where: { stripePaymentId: paymentIntentId },
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    if (existingOrder) {
      return existingOrder;
    }

    // Retrieve from Stripe directly to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      throw new AppError(`Payment not succeeded. Status: ${paymentIntent.status}`, 400);
    }

    return this.handleSuccessfulPayment(paymentIntent);
  }
}
