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
    content: z.string({
      required_error: 'Message content is required',
    }).min(1, 'Message cannot be empty'),
    attachments: z.array(z.string().url()).optional(),
  }),
});

export const ChatValidation = {
  initiateChatValidationSchema,
  initiateP2PChatValidationSchema,
  sendMessageValidationSchema,
};