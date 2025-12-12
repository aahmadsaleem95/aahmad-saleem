import { Router } from 'express';
import { cookieAuthMiddleware } from '../../middleware/auth.middleware';
import { askController, historyController, usageController } from './chat.controller';
import { validate } from '../../middleware/validate';
import { askSchema } from './chat.validators';

const router = Router();

// All chat endpoints require auth
router.post('/ask', cookieAuthMiddleware, validate(askSchema), askController);
router.get('/history', cookieAuthMiddleware, historyController);
router.get('/usage', cookieAuthMiddleware, usageController);

export default router;
