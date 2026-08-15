import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authCheck, adminCheck } from "../middlewares/authCheck";
import { validate } from "../middlewares/validate";
import { changeStatusSchema, changeRoleSchema } from "../schemas/auth.schema";
import { updateOrderStatusSchema } from "../schemas/category.schema";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const adminGuard = [authCheck as any, adminCheck as any];

router.get("/users", ...adminGuard, asyncHandler(AdminController.listUsers));
router.post("/change-status", ...adminGuard, validate(changeStatusSchema), asyncHandler(AdminController.changeStatus));
router.post("/change-role", ...adminGuard, validate(changeRoleSchema), asyncHandler(AdminController.changeRole));
router.get("/admin/orders", ...adminGuard, asyncHandler(AdminController.getOrders));
router.put("/admin/order-status", ...adminGuard, validate(updateOrderStatusSchema), asyncHandler(AdminController.changeOrderStatus));

export default router;
