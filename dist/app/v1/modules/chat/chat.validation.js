"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatValidation = void 0;
const v3_1 = require("zod/v3");
const initiateChatValidationSchema = v3_1.z.object({
    body: v3_1.z.object({}),
});
const initiateP2PChatValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        recipientId: v3_1.z.string({ required_error: 'Recipient ID is required' }),
    }),
});
const sendMessageValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        chat_id: v3_1.z.string({
            required_error: 'Chat ID is required',
        }),
        content: v3_1.z.string().optional(),
        attachments: v3_1.z.array(v3_1.z.string()).optional(),
    }),
});
exports.ChatValidation = {
    initiateChatValidationSchema,
    initiateP2PChatValidationSchema,
    sendMessageValidationSchema,
};
//# sourceMappingURL=chat.validation.js.map