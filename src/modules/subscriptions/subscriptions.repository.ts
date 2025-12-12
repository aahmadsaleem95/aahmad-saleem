import { prisma } from '../../config/prisma';

export const SubscriptionRepository = {
  async create(data: {
    userId: number;
    tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
    billingCycle: 'MONTHLY' | 'YEARLY';
    maxMessages: number;
    price: number;
    startDate: Date;
    endDate: Date;
    renewalDate: Date;
    autoRenew: boolean;
  }) {
    return prisma.subscription.create({ data });
  },

  async getActiveSubscriptionsForUser(userId: number) {
    return prisma.subscription.findMany({
      where: { userId, isActive: true },
      orderBy: { endDate: 'desc' },
    });
  },

  async getById(id: number) {
    return prisma.subscription.findUnique({ where: { id } });
  },

  async update(id: number, data: any) {
    return prisma.subscription.update({ where: { id }, data });
  },
};
