import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authCheck, adminCheck } from "../middlewares/authCheck";
import { validate } from "../middlewares/validate";
import { createCategorySchema } from "../schemas/category.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/category",
  authCheck as any,
  adminCheck as any,
  validate(createCategorySchema),
  asyncHandler(CategoryController.create)
);

router.get("/category", asyncHandler(CategoryController.list));

router.delete(
  "/category/:id",
  authCheck as any,
  adminCheck as any,
  asyncHandler(CategoryController.remove)
);

export default router;
