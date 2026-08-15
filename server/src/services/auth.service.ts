import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from "../utils/token";

export class AuthService {
  static async register(email: string, password: string, name?: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  static async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.enabled) {
      throw new AppError("Account has been disabled. Please contact support.", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        picture: user.picture,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || !user.enabled || user.refreshToken !== refreshToken) {
      throw new AppError("Invalid refresh session", 401);
    }

    const newPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async getCurrentUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        picture: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
