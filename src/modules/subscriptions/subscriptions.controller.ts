import { Response } from 'express';
import { ControllerRequest } from '../../types';
import { asyncHandler } from '../../core/asyncHandler';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionRepository } from './subscriptions.repository';

export const createController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const { tier, billingCycle, autoRenew } = req.validated?.body;
  const userId = req.userId as number;

  const bundle = await SubscriptionService.createSubscription({
    userId,
    tier,
    billingCycle,
    autoRenew: autoRenew === undefined ? true : !!autoRenew,
  });

  res.status(201).json(bundle);
});

export const cancelController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const { id } = req.validated?.params;
  const userId = req.userId as number;

  await SubscriptionService.cancelSubscription({ userId, subscriptionId: id });
  res.json({ ok: true });
});

export const listController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const userId = req.userId as number;
  const subs = await SubscriptionRepository.getActiveSubscriptionsForUser(userId);
  res.json(subs);
});
