import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { OrderController } from "../controllers/order.controller";
import { authCheck } from "../middlewares/authCheck";
import { validate } from "../middlewares/validate";
import { userCartSchema } from "../schemas/category.schema";
import { saveAddressSchema } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Cart endpoints
router.post(
  "/user/cart",
  authCheck as any,
  validate(userCartSchema),
  asyncHandler(CartController.userCart as any)
);

router.get(
  "/user/cart",
  authCheck as any,
  asyncHandler(CartController.getUserCart as any)
);

router.delete(
  "/user/cart",
  authCheck as any,
  asyncHandler(CartController.emptyCart as any)
);

// Address & Orders endpoints
router.post(
  "/user/address",
  authCheck as any,
  validate(saveAddressSchema),
  asyncHandler(OrderController.saveAddress as any)
);

router.post(
  "/user/order",
  authCheck as any,
  asyncHandler(OrderController.saveOrder as any)
);

router.get(
  "/user/order",
  authCheck as any,
  asyncHandler(OrderController.getUserOrders as any)
);

export default router;
