import { z } from 'zod';
import { Source } from '../types';
import { RequestHandler } from 'express';

export const validate =
  (schema: z.ZodType<any, any>, source: Source = 'body'): RequestHandler =>
  (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;

      const parsed = schema.parse(data);

      // Attach validated result
      // @ts-ignore
      req.validated = req.validated ?? {};
      // @ts-ignore
      req.validated[source] = parsed;

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          errorCode: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: JSON.parse(error.message),
        });
      }
      return next(error);
    }
  };
