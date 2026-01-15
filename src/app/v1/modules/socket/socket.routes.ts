import { Router } from 'express';
import { socketHealthCheck } from './socket.controller';

const router = Router();

/**
 * @route GET /socket/health
 * @desc Check socket server status
 */
router.get('/health', socketHealthCheck);

export const socketRoutes = router;
