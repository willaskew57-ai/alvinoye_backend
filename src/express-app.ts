// ** import packages **
import express, {
  type Application,
  type Request,
  type Response,
} from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ** import local files **
import { notFound } from './middleware/notFound';
import healthCheck from './app/v1/modules/health-check';
import router from './app/v1/routes';
import globalErrorHandler from './middleware/global-error-handler';
import { globalLimiter } from './middleware/rate-limiter';
import { sendSms } from './utils/send-sms';
// import { sendSms } from './utils/send-sms';

// ** create application :
const app: Application = express();

// ** parsers :
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://13.63.95.203:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Apply the global rate limiting middleware to all requests.
app.use('/api', globalLimiter);

// For local file
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// test route:
app.get('/health', healthCheck);

// application routes:
app.use('/api/v1', router);

// test send sms:
app.post('/test/send-sms', async (req: Request, res: Response) => {
  const { to, message } = req.body;
  
  if (!to || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide "to" and "message" parameters' 
    });
  }
  
  const result = await sendSms(to, message);
  
  if (result.success) {
    res.json({ 
      success: true, 
      message: `SMS sent successfully to ${to}`,
      sid: result.sid 
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send SMS',
      error: result.error 
    });
  }
});

// main route:
app.get('/', (req: Request, res: Response) => {
  res.send('Yah!!! our server is running now.......');
});

// global Error Handler:
app.use(globalErrorHandler);

// notFound:
app.use(notFound);

// export :
export default app;
