import { Response } from 'express';
import { ControllerRequest } from '../../types';
import { asyncHandler } from '../../core/asyncHandler';
import * as AuthService from './auth.service';

export const signupController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const { email, password, name } = req.validated?.body;

  const { id } = await AuthService.signup({ email, password, name });
  res.status(201).json({ id, email });
});

export const loginController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const { email, password } = req.validated?.body;

  const token = await AuthService.login({ email, password });

  const secure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';

  res.cookie('session_token', token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ message: 'Logged in' });
});

export const logoutController = asyncHandler(async (_req: ControllerRequest, res: Response) => {
  res.clearCookie('session_token');
  res.json({ message: 'Logged out' });
});

export const meController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const user = req?.user;
  res.json({ user });
});
