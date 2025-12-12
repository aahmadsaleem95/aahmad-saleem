import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import { prisma } from './config/prisma';
import { startCronJobs } from './core/cron';
import { errorHandler } from './middleware/error-handler';

import authRoutes from './modules/auth/auth.routes';
import chatRoutes from './modules/chat/chat.routes';
import subscriptionRoutes from './modules/subscriptions/subscriptions.routes';

export const app = express();

// CORS: allow credentials (cookies) from frontend origin in production set CLIENT_URL
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    credentials: true,
  })
);

app.use(json());
app.use(cookieParser());

// Public routes
app.use('/api/auth', authRoutes);

// Protected modules (they themselves apply auth middleware where needed)
app.use('/api/chat', chatRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

// global error handler
app.use(errorHandler);

// start cron jobs after app boot
startCronJobs(prisma);
