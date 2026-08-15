import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authCheck, adminCheck } from "../middlewares/authCheck";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  updateProductSchema,
  searchProductSchema,
} from "../schemas/product.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post(
  "/product",
  authCheck as any,
  adminCheck as any,
  validate(createProductSchema),
  asyncHandler(ProductController.create)
);

router.get("/products/:count", asyncHandler(ProductController.list));
router.get("/product/:id", asyncHandler(ProductController.read));

router.put(
  "/product/:id",
  authCheck as any,
  adminCheck as any,
  validate(updateProductSchema),
  asyncHandler(ProductController.update)
);

router.delete(
  "/product/:id",
  authCheck as any,
  adminCheck as any,
  asyncHandler(ProductController.remove)
);

router.post("/productby", asyncHandler(ProductController.listBy));
router.post(
  "/search/filters",
  validate(searchProductSchema),
  asyncHandler(ProductController.searchFilters)
);

router.post(
  "/images",
  authCheck as any,
  adminCheck as any,
  asyncHandler(ProductController.createImage)
);

router.post(
  "/removeimages",
  authCheck as any,
  adminCheck as any,
  asyncHandler(ProductController.removeImage)
);

export default router;
