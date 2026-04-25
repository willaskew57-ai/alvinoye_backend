"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSmsJob = void 0;
const send_sms_1 = require("../../utils/send-sms");
const sendSmsJob = async (payload) => {
    try {
        const result = await (0, send_sms_1.sendSms)(payload.to, payload.body);
        if (result.success) {
            console.log(`[sms.job] SMS sent successfully to ${payload.to}`);
        }
        return result;
    }
    catch (error) {
        console.error(`[sms.job] Failed to send SMS to ${payload.to}:`, error);
        return {
            success: false,
            error: error.message || 'Failed to send SMS',
        };
    }
};
exports.sendSmsJob = sendSmsJob;
//# sourceMappingURL=sms.job.js.map