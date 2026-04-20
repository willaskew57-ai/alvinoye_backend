"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushEmailJob = exports.emailQueue = void 0;
const queue_1 = __importDefault(require("queue"));
const emailQueue = new queue_1.default({
    concurrency: 2,
    autostart: true,
});
exports.emailQueue = emailQueue;
const MAX_RETRIES = 3;
const pushEmailJob = async (emailJob, emailAddress) => {
    emailQueue.push(async () => {
        let attempt = 0;
        const attemptSend = async () => {
            attempt++;
            try {
                await emailJob();
            }
            catch (error) {
                console.error(`[email.queue] Attempt ${attempt}/${MAX_RETRIES} failed${emailAddress ? ` for ${emailAddress}` : ''}:`, error);
                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                    return attemptSend();
                }
                console.error(`[email.queue] All ${MAX_RETRIES} attempts failed${emailAddress ? ` for ${emailAddress}` : ''}`);
                throw error;
            }
        };
        await attemptSend();
    });
};
exports.pushEmailJob = pushEmailJob;
//# sourceMappingURL=email.queue.js.map