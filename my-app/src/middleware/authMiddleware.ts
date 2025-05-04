import { verifyJwtToken } from '../utils/jwt';
import { Context } from 'hono';
import type { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'Missing Authorization Bearer token' }, 401);
  }

  const result = verifyJwtToken(token, false); // ใช้ access token (isRefresh = false)

  if (!result.success) {
    return c.json({ error: result.message }, 401);
  }

  // เพิ่ม user payload ใน context
  c.set('user', result.payload as JwtPayload);
  await next();
};
