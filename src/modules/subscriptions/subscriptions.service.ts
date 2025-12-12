import { TIERS } from '../../types';
import { addMonths } from 'date-fns';
import { SubscriptionRepository } from './subscriptions.repository';
import { BadRequestError, NotFoundError } from '../../core/errors';

export const SubscriptionService = {
  async createSubscription(opts: {
    userId: number;
    tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
    billingCycle: 'MONTHLY' | 'YEARLY';
    autoRenew?: boolean;
  }) {
    const { userId, tier, billingCycle } = opts;
    const autoRenew = opts.autoRenew === undefined ? true : !!opts.autoRenew;
    const config = TIERS[tier];
    if (!config) throw new BadRequestError('Invalid tier');

    const now = new Date();
    const monthsToAdd = billingCycle === 'MONTHLY' ? 1 : 12;
    const endDate = addMonths(now, monthsToAdd);
    const renewalDate = endDate;

    const sub = await SubscriptionRepository.create({
      userId,
      tier,
      billingCycle,
      maxMessages: config.maxMessages,
      price: config.priceCents / 100,
      startDate: now,
      endDate,
      renewalDate,
      autoRenew,
    });

    return sub;
  },

  async cancelSubscription(opts: { userId: number; subscriptionId: number }) {
    const now = new Date();
    const { userId, subscriptionId } = opts;
    const sub = await SubscriptionRepository.getById(subscriptionId);
    if (!sub) throw new NotFoundError('Subscription not found');
    if (sub.userId !== userId) throw new BadRequestError('Not your subscription');

    // Prevent renewal but keep subscription active until endDate
    await SubscriptionRepository.update(subscriptionId, { autoRenew: false, updatedAt: now });
    return true;
  },
};
