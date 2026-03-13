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

// For local file
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// test route:
app.get('/health', healthCheck);

// application routes:
app.use('/api/v1', router);

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
