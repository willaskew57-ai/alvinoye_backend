import twilio from 'twilio';
import configs from '../config/env.config';

const accountSid = configs.twilio_account_sid as string;
const authToken = configs.twilio_auth_token as string;
const twilioPhone = configs.twilio_phone_number as string;

const client = twilio(accountSid, authToken);

interface SendSmsResponse {
  success: boolean;
  sid?: string;
  message?: string;
  error?: string;
}

export const sendSms = async (to: string, body: string): Promise<SendSmsResponse> => {
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
  } catch (error: any) {
    console.error('SMS Send Error:', error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};