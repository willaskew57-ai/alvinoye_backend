import type { Request, Response } from 'express';
import { getDBStatus } from '../../../../db';
import { getIO } from '../../../../socket';

export const socketHealthCheck = (req: Request, res: Response) => {
  const db = getDBStatus();

  let socketStatus = 'not_initialized';
  try {
    const io = getIO();
    socketStatus = io ? 'initialized' : 'not_initialized';
  } catch {
    socketStatus = 'not_initialized';
  }

  return res.status(db.isConnected ? 200 : 503).json({
    status: db.isConnected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    socket: socketStatus,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      database: db.stateLabel,
      server: 'running',
    },
    metrics: {
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      },
    },
  });
};
