import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/authCheck";
import { AppError } from "../utils/AppError";

const REFRESH_COOKIE_NAME = "refreshToken";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const user = await AuthService.register(email, password, name);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user,
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);

    // Set secure httpOnly refresh token cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      status: "success",
      token: accessToken,
      refreshToken,
      payload: user,
    });
  }

  static async refresh(req: Request, res: Response) {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    if (!token) {
      throw new AppError("Refresh token is required", 401);
    }

    const { accessToken, refreshToken } = await AuthService.refreshTokens(token);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: "success",
      token: accessToken,
      refreshToken,
    });
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.json({ status: "success", message: "Logged out successfully" });
  }

  static async currentUser(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const user = await AuthService.getCurrentUser(req.user.id);
    res.json({ user });
  }
}
