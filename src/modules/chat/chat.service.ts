import { prisma } from '../../config/prisma';
import { QuotaExceededError } from '../../core/errors';
import { ChatRepository } from './chat.repository';
import { FREE_MESSAGES_PER_MONTH, MOCK_AI_DELAY_MS } from '../../utils/constants';

// DDD-style service: orchestrates domain rules
export const ChatService = {
  async askQuestion(opts: { userId: number; question: string }) {
    const now = new Date();
    const { userId, question } = opts;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Ensure freeMessagesUsed is reset by cron; safety check: if freeMessagesUsed < 0 -> reset
    // Check free quota
    if (user.freeMessagesUsed < FREE_MESSAGES_PER_MONTH) {
      await prisma.user.update({
        where: { id: userId },
        data: { freeMessagesUsed: { increment: 1 }, updatedAt: now },
      });
    } else {
      // find available subscriptions: active and with remaining messages or unlimited
      const subs = await prisma.subscription.findFirst({
        where: {
          userId,
          isActive: true,
          maxMessages: { gt: prisma.subscription.fields.usedMessages },
        },
        orderBy: { endDate: 'desc' },
      });

      if (!subs) {
        throw new QuotaExceededError(
          'No remaining free messages or active subscription with quota.'
        );
      }

      if (subs.maxMessages !== null) {
        await prisma.subscription.update({
          where: { id: subs.id },
          data: { usedMessages: { increment: 1 }, updatedAt: now },
        });
      }
    }

    // Simulate OpenAI delay
    await new Promise((r) => setTimeout(r, MOCK_AI_DELAY_MS));

    const answer = `Mocked OpenAI response for: "${question}"`;
    const tokens = Math.max(1, question.split(/\s+/).length * 2);

    const saved = await ChatRepository.saveMessage({
      userId,
      question,
      answer,
      tokensUsed: tokens,
    });

    return {
      id: saved.id,
      question: saved.question,
      answer: saved.answer,
      tokensUsed: saved.tokensUsed,
      createdAt: saved.createdAt,
    };
  },

  async getUsage(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });
    if (!user) throw new Error('User not found');

    const totalMessages = await ChatRepository.countMessagesByUser(userId);

    return {
      userId,
      freeMessagesUsed: user.freeMessagesUsed,
      freeMessagesMax: FREE_MESSAGES_PER_MONTH,
      totalMessages,
      subscriptions: user.subscriptions.map((s) => ({
        id: s.id,
        tier: s.tier,
        maxMessages: s.maxMessages,
        usedMessages: s.usedMessages,
        remaining: s.maxMessages === null ? null : s.maxMessages - s.usedMessages,
        isActive: s.isActive,
        billingCycle: s.billingCycle,
      })),
    };
  },
};
