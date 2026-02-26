import { Schema } from 'mongoose';
import { z } from 'zod/v3';

const initiateChatValidationSchema = z.object({
  body: z.object({}), // Since support chat is auto-initiated based on req.user, body is empty
});

const initiateP2PChatValidationSchema = z.object({
  body: z.object({
    recipientId: z.string({ required_error: 'Recipient ID is required' }),
  }),
});

const sendMessageValidationSchema = z.object({
  body: z.object({
    chat_id: z.string({
      required_error: 'Chat ID is required',
    }),
    // CHANGE THIS: .optional()
    content: z.string().optional(), 
    attachments: z.array(z.string()).optional(),
  }),
});

export const ChatValidation = {
  initiateChatValidationSchema,
  initiateP2PChatValidationSchema,
  sendMessageValidationSchema,
};