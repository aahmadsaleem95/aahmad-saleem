import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  tier: z.enum(['BASIC', 'PRO', 'ENTERPRISE']),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  autoRenew: z.boolean().optional(),
});

export const cancelSubscriptionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
