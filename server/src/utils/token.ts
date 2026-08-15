import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET || "default_jwt_secret_key_change_me";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "default_refresh_secret_key_change_me";

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
