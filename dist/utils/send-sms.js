"use strict";
// utils/sendSms.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
const env_config_1 = __importDefault(require("../config/env.config"));
const accountSid = env_config_1.default.twilio_account_sid;
const authToken = env_config_1.default.twilio_auth_token;
const twilioPhone = env_config_1.default.twilio_phone_number;
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSms = async (to, body) => {
    try {
        const message = await client.messages.create({
            body,
            from: twilioPhone,
            to,
        });
        return {
            success: true,
            sid: message.sid,
            message: message.body,
        };
    }
    catch (error) {
        console.error('SMS Send Error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};
exports.sendSms = sendSms;
//# sourceMappingURL=send-sms.js.map