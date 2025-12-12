import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.code,
      message: err.message,
      details: err.details ?? null,
    });
  }
  console.error(err);
  res.status(500).json({ errorCode: 'INTERNAL_ERROR', message: 'Internal server error' });
}
