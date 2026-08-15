import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/token";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authentication token is required", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { enabled: true, id: true, role: true, email: true },
    });

    if (!user) {
      return next(new AppError("User account not found", 401));
    }

    if (!user.enabled) {
      return next(new AppError("Account has been disabled", 403));
    }

    next();
  } catch (error) {
    next(new AppError("Invalid or expired authentication token", 401));
  }
};

export const adminCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return next(new AppError("Access denied: Admin privileges required", 403));
    }
    next();
  } catch (error) {
    next(new AppError("Admin authorization error", 403));
  }
};
