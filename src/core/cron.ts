import cron from 'node-cron';
import { PrismaClient } from '../generated/prisma/client';
import { addMonths } from 'date-fns';

/**
 * Daily cron at 00:05 server time:
 * - reset free quota on 1st
 * - process auto renewals for subscriptions
 */
export function startCronJobs(prisma: PrismaClient) {
  cron.schedule('5 0 * * *', async () => {
    try {
      console.log('[cron] running daily tasks');
      const now = new Date();

      // Reset free messages on the 1st of each month
      if (now.getDate() === 12) {
        await prisma.user.updateMany({
          data: { freeMessagesUsed: 0 },
        });
        console.log('[cron] reset freeMessagesUsed for all users');
      }

      await prisma.subscription.updateMany({
        where: {
          autoRenew: false,
          isActive: true,
          endDate: {
            lte: now,
          },
        },
        data: {
          isActive: false,
          updatedAt: now,
        },
      });

      // Process auto-renew
      const subs = await prisma.subscription.findMany({
        where: { autoRenew: true, isActive: true },
      });

      for (const s of subs) {
        if (s.renewalDate <= now) {
          const success = Math.random() < 0.8; // 80% chance payment success
          if (success) {
            const monthsToAdd = s.billingCycle === 'MONTHLY' ? 1 : 12;
            const newEnd = addMonths(s.endDate, monthsToAdd);
            const newRenewal = addMonths(s.renewalDate, monthsToAdd);
            await prisma.subscription.update({
              where: { id: s.id },
              data: { endDate: newEnd, renewalDate: newRenewal, usedMessages: 0, updatedAt: now },
            });
            console.log(`[cron] renewed subscription ${s.id}`);
          } else {
            await prisma.subscription.update({
              where: { id: s.id },
              data: { isActive: false, autoRenew: false, updatedAt: now },
            });
            console.log(`[cron] subscription ${s.id} payment failed -> deactivated`);
          }
        }
      }
    } catch (err) {
      console.error('[cron] error', err);
    }
  });
}
