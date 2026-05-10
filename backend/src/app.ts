/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// application routes
import { PaymentControllers } from './app/modules/Payment/payment.controller';
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), PaymentControllers.handleWebhook);

// Parser
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
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
