/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './app/config';
import dns from 'node:dns';

// Force Google DNS for SRV resolution (needed for Vercel + MongoDB Atlas)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app: Application = express();

// Database Connection for Serverless Environment
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(config.database_URL as string);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    // Don't throw here, let the request handler fail if needed or retry
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://supershop-two.vercel.app',
    "https://www.supershop-two.vercel.app",
    "http://supershop-two.vercel.app",
    "supershop-two.vercel.app"],
  credentials: true
}
));

// application routes
import { PaymentControllers } from './app/modules/Payment/payment.controller';
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), PaymentControllers.handleWebhook);

// Parser
app.use(express.json());
app.use(cookieParser());

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const testRoute = (req: Request, res: Response) => {
  Promise.reject();
  // const a = 10;
  res.send(req.body);
};

app.get('/test', testRoute);

// global error handler
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
