// utils/sendSms.ts
import twilio from 'twilio';
import configs from '../config/env.config';
const accountSid = configs.twilio_account_sid;
const authToken = configs.twilio_auth_token;
const twilioPhone = configs.twilio_phone_number;
const client = twilio(accountSid, authToken);
export const sendSms = async (to, body) => {
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
//# sourceMappingURL=send-sms.js.map