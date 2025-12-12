import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: number;
  user?: { id: number; email: string; name?: string };
}

export interface ControllerRequest extends AuthRequest {
  validated?: {
    body?: any;
    params?: any;
    query?: any;
  };
}

export const TIERS: Record<string, { maxMessages: number; priceCents: number }> = {
  BASIC: { maxMessages: 10, priceCents: 500 },
  PRO: { maxMessages: 100, priceCents: 2000 },
  ENTERPRISE: { maxMessages: 999999999, priceCents: 9900 },
};

export type Source = 'body' | 'params' | 'query';
