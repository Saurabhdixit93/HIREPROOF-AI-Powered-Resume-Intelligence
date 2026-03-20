import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { AppEnv } from '../app';
import { config } from '../config/env';

const JWT_SECRET = config.jwtSecret;

export const authMiddleware = async (c: Context<AppEnv>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    c.set('userId', decoded.id);
    await next();
  } catch (error) {
    return c.json({ success: false, message: 'Invalid or expired token' }, 401);
  }
};
