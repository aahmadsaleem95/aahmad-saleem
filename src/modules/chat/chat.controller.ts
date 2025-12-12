import { Response } from 'express';
import { ControllerRequest } from '../../types';
import { asyncHandler } from '../../core/asyncHandler';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';

export const historyController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const userId = req.userId as number;
  const messages = await ChatRepository.getMessagesByUser(userId);
  res.json(messages);
});

export const askController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const { question } = req.validated?.body;
  const userId = req.userId as number;

  const result = await ChatService.askQuestion({ userId, question });
  res.json(result);
});

export const usageController = asyncHandler(async (req: ControllerRequest, res: Response) => {
  const userId = req.userId as number;
  const usage = await ChatService.getUsage(userId);
  res.json(usage);
});
