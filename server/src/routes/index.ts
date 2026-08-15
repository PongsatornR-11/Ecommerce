import { Router } from "express";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import userRoutes from "./user.routes";
import stripeRoutes from "./stripe.routes";
import adminRoutes from "./admin.routes";

const apiRouter = Router();

apiRouter.use(authRoutes);
apiRouter.use(categoryRoutes);
apiRouter.use(productRoutes);
apiRouter.use(userRoutes);
apiRouter.use(stripeRoutes);
apiRouter.use(adminRoutes);

export default apiRouter;
