"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ** import packages **
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// ** import local files **
const notFound_1 = require("./middleware/notFound");
const health_check_1 = __importDefault(require("./app/v1/modules/health-check"));
const routes_1 = __importDefault(require("./app/v1/routes"));
const global_error_handler_1 = __importDefault(require("./middleware/global-error-handler"));
const rate_limiter_1 = require("./middleware/rate-limiter");
const send_sms_1 = require("./utils/send-sms");
// import { sendSms } from './utils/send-sms';
// ** create application :
const app = (0, express_1.default)();
app.set('trust proxy', 1);
// ** parsers :
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:5175', 'http://13.63.95.203:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Apply the global rate limiting middleware to all requests.
app.use('/api', rate_limiter_1.globalLimiter);
// For local file
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// test route:
app.get('/health', health_check_1.default);
// application routes:
app.use('/api/v1', routes_1.default);
// test send sms:
app.post('/test/send-sms', async (req, res) => {
    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please provide "to" and "message" parameters'
        });
    }
    const result = await (0, send_sms_1.sendSms)(to, message);
    if (result.success) {
        res.json({
            success: true,
            message: `SMS sent successfully to ${to}`,
            sid: result.sid
        });
    }
    else {
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS',
            error: result.error
        });
    }
});
// main route:
app.get('/', (req, res) => {
    res.send('Yah!!! our server is running now.......');
});
// global Error Handler:
app.use(global_error_handler_1.default);
// notFound:
app.use(notFound_1.notFound);
// export :
exports.default = app;
//# sourceMappingURL=express-app.js.map