import { sendSms } from '../../utils/send-sms';

export interface SendSmsPayload {
  to: string;
  body: string;
}

export const sendSmsJob = async (payload: SendSmsPayload): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await sendSms(payload.to, payload.body);
    if (result.success) {
      console.log(`[sms.job] SMS sent successfully to ${payload.to}`);
    }
    return result;
  } catch (error: any) {
    console.error(`[sms.job] Failed to send SMS to ${payload.to}:`, error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
    };
  }
};
