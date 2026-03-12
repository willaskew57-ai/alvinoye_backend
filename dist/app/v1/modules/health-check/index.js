// ** import local files
import configs from '../../../../config/env.config';
import { getDBStatus } from '../../../../db';
const healthCheck = async (req, res) => {
    const db = getDBStatus();
    const healthCheck = {
        status: db.isConnected ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
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
            port: configs.port,
        },
    };
    res.status(db.isConnected ? 200 : 503).json(healthCheck);
};
export default healthCheck;
//# sourceMappingURL=index.js.map