import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../src/config/prisma';
import { BadRequestError, UnauthorizedError } from '../../core/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export async function signup(data: { email: string; password: string; name?: string }) {
  const { email, password, name } = data;
  if (!email || !password) throw new BadRequestError('email and password required');

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new BadRequestError('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
    },
  });

  return { id: user.id, email: user.email };
}

export async function login(data: { email: string; password: string }) {
  const { email, password } = data;
  if (!email || !password) throw new BadRequestError('email and password required');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedError('Invalid credentials');

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return token;
}
