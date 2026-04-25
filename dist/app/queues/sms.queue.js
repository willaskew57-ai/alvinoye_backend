"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushSmsJob = exports.smsQueue = void 0;
const better_queue_1 = __importDefault(require("better-queue"));
const smsQueue = new better_queue_1.default(async (task, cb) => {
    try {
        await task();
        cb();
    }
    catch (err) {
        cb(err);
    }
}, {
    concurrent: 2,
    // autostart: true,
});
exports.smsQueue = smsQueue;
const MAX_RETRIES = 3;
const pushSmsJob = async (smsJob, phoneNumber) => {
    smsQueue.push(async () => {
        let attempt = 0;
        const attemptSend = async () => {
            attempt++;
            try {
                const result = await smsJob();
                if (!result.success) {
                    throw new Error(result.error || 'SMS send failed');
                }
            }
            catch (error) {
                console.error(`[sms.queue] Attempt ${attempt}/${MAX_RETRIES} failed${phoneNumber ? ` for ${phoneNumber}` : ''}:`, error);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    return attemptSend();
                }
                console.error(`[sms.queue] All ${MAX_RETRIES} attempts failed${phoneNumber ? ` for ${phoneNumber}` : ''}`);
                throw error;
            }
        };
        await attemptSend();
    });
};
exports.pushSmsJob = pushSmsJob;
//# sourceMappingURL=sms.queue.js.map