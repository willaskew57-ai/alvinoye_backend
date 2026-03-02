// ** import packages **
import express, {} from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// ** import local files **
import { notFound } from './middleware/notFound';
import healthCheck from './app/v1/modules/health-check';
import router from './app/v1/routes';
import globalErrorHandler from './middleware/global-error-handler';
// ** create application :
const app = express();
// ** parsers :
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
// For local file 
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// test route:
app.get('/health', healthCheck);
// application routes:
app.use('/api/v1', router);
// main route:
app.get('/', (req, res) => {
    res.send('Yah!!! our server is running now.......');
});
// global Error Handler:
app.use(globalErrorHandler);
// notFound:
app.use(notFound);
// export :
export default app;
//# sourceMappingURL=app.js.map