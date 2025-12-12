import { prisma } from '../../config/prisma';

export const ChatRepository = {
  async saveMessage(data: {
    userId: number;
    question: string;
    answer: string;
    tokensUsed: number;
  }) {
    return prisma.chatMessage.create({
      data: {
        userId: data.userId,
        question: data.question,
        answer: data.answer,
        tokensUsed: data.tokensUsed,
      },
    });
  },

  async getMessagesByUser(userId: number) {
    return prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async countMessagesByUser(userId: number) {
    return prisma.chatMessage.count({ where: { userId } });
  },
};
