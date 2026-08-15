import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service";
import { AuthenticatedRequest } from "../middlewares/authCheck";
import { AppError } from "../utils/AppError";

export class StripeController {
  static async createPaymentIntent(req: AuthenticatedRequest, res: Response) {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const result = await StripeService.createPaymentIntent(req.user.id);
    res.json(result);
  }

  static async handleWebhook(req: Request, res: Response) {
    const signature = req.headers["stripe-signature"] as string;
    if (!signature) {
      throw new AppError("Missing stripe-signature header", 400);
    }

    const event = StripeService.constructWebhookEvent(req.body, signature);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        await StripeService.handleSuccessfulPayment(paymentIntent);
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    res.json({ received: true });
  }
}
