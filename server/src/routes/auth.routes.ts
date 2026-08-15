import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authCheck } from "../middlewares/authCheck";
import { validate } from "../middlewares/validate";
import { authLimiter } from "../middlewares/rateLimiter";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(AuthController.register)
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncHandler(AuthController.login)
);

router.post("/refresh", asyncHandler(AuthController.refresh));
router.post("/logout", asyncHandler(AuthController.logout));

router.post(
  "/current-user",
  authCheck as any,
  asyncHandler(AuthController.currentUser as any)
);

router.post(
  "/current-admin",
  authCheck as any,
  asyncHandler(AuthController.currentUser as any)
);

export default router;
