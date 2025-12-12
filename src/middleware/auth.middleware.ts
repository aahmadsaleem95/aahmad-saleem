import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { UnauthorizedError } from '../core/errors';

const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export async function cookieAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.session_token;
    if (!token) throw new UnauthorizedError('Not authenticated');

    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; iat?: number; exp?: number };
    const userId = payload.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedError('Invalid session');

    req.userId = userId;
    req.user = { id: user.id, email: user.email, name: user.name ?? undefined };
    next();
  } catch (err) {
    console.log('Error: ', err);
    next(new UnauthorizedError('Invalid or expired session'));
  }
}
