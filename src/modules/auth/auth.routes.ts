import { Router } from 'express';
import {
  signupController,
  loginController,
  logoutController,
  meController,
} from './auth.controller';
import { cookieAuthMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate';
import { signupSchema, loginSchema } from './auth.validators';

const router = Router();

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);
router.post('/logout', logoutController);
router.get('/me', cookieAuthMiddleware, meController);

export default router;
