import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { generalLimiter } from "./middlewares/rateLimiter";
import { StripeController } from "./controllers/stripe.controller";
import { asyncHandler } from "./utils/asyncHandler";
import { AppError } from "./utils/AppError";

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(helmet());

  // Logging
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // CORS Configuration
  const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    })
  );

  // Cookie Parser
  app.use(cookieParser());

  // Stripe Webhook Route - requires RAW body for cryptographic signature verification
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    asyncHandler(StripeController.handleWebhook)
  );

  // Standard JSON & URL-encoded body parser for all other routes
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // General Rate Limiter
  app.use("/api", generalLimiter);

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API routes
  app.use("/api", apiRouter);

  // 404 Route Handler
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
  });

  // Centralized Error Handler Middleware
  app.use(errorHandler);

  return app;
};
