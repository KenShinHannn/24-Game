import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { z } from "zod";
import { Context } from "vm";

const envSchema = z.object({
  SECRET_KEY: z.string().min(1, "Missing JWT_SECRET in .env"),
  JWT_REFRESH_SECRET: z.string().min(1, "Missing JWT_REFRESH_SECRET in .env"),
});

const env = envSchema.parse(process.env);
const secret_key = env.SECRET_KEY;
const jwt_refresh_secret = env.JWT_REFRESH_SECRET;

type Payload = {
  id: number;
  username: string;
};

export function generateJwtToken(
  id: number,
  username: string,
  isRefresh: boolean
): string {
  const payload: Payload = { id, username };
  const secret = isRefresh ? jwt_refresh_secret : secret_key;
  const expiresIn = isRefresh ? "7d" : "1h";

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwtToken(
  token: string,
  isRefresh: boolean
):
  | { success: true; payload: JwtPayload }
  | { success: false; message: string } {
  const secret = isRefresh ? jwt_refresh_secret : secret_key;

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") {
      return { success: false, message: "Invalid token payload" };
    }
    return { success: true, payload: decoded };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        message: isRefresh ? "Refresh token has expired" : "Token has expired",
      };
    } else if (err instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        message: isRefresh ? "Invalid refresh token" : "Invalid token",
      };
    }
    return { success: false, message: "Token verification failed" };
  }
}

export const extractTokenFromHeader = (c: Context): string | null => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return null; 
  }

  const token = authHeader.replace('Bearer ', '');
  return token ? token : null; 
};