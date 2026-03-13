"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ** import local files
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const db_1 = require("../../../../db");
const healthCheck = async (req, res) => {
    const db = (0, db_1.getDBStatus)();
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
            port: env_config_1.default.port,
        },
    };
    res.status(db.isConnected ? 200 : 503).json(healthCheck);
};
exports.default = healthCheck;
//# sourceMappingURL=index.js.map