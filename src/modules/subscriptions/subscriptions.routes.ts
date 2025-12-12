import { Router } from 'express';
import { cookieAuthMiddleware } from '../../middleware/auth.middleware';
import { createController, cancelController, listController } from './subscriptions.controller';
import { validate } from '../../middleware/validate';
import {
  createSubscriptionSchema,
  cancelSubscriptionParamsSchema,
} from './subscriptions.validators';

const router = Router();

router.post('/create', cookieAuthMiddleware, validate(createSubscriptionSchema), createController);
router.post(
  '/cancel/:id',
  cookieAuthMiddleware,
  validate(cancelSubscriptionParamsSchema, 'params'),
  cancelController
);
router.get('/active', cookieAuthMiddleware, listController);

export default router;
