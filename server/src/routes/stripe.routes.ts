import { Router } from "express";
import { StripeController } from "../controllers/stripe.controller";
import { authCheck } from "../middlewares/authCheck";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/user/create-payment-intent",
  authCheck as any,
  asyncHandler(StripeController.createPaymentIntent as any)
);

export default router;
