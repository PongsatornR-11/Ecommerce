import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof AppError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    error = new AppError(message, statusCode, error.errors);
  }

  // Handle specific known error types
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid authentication token", 401);
  } else if (err.name === "TokenExpiredError") {
    error = new AppError("Authentication token expired", 401);
  }

  const response: any = {
    status: error.status,
    message: error.message,
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};
