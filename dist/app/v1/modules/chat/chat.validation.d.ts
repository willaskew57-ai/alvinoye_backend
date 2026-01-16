import { z } from 'zod/v3';
export declare const ChatValidation: {
    initiateChatValidationSchema: z.ZodObject<{
        body: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    }, "strip", z.ZodTypeAny, {
        body: {};
    }, {
        body: {};
    }>;
    initiateP2PChatValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            recipientId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            recipientId: string;
        }, {
            recipientId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            recipientId: string;
        };
    }, {
        body: {
            recipientId: string;
        };
    }>;
    sendMessageValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            chat_id: z.ZodString;
            content: z.ZodString;
            attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            content: string;
            chat_id: string;
            attachments?: string[] | undefined;
        }, {
            content: string;
            chat_id: string;
            attachments?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            content: string;
            chat_id: string;
            attachments?: string[] | undefined;
        };
    }, {
        body: {
            content: string;
            chat_id: string;
            attachments?: string[] | undefined;
        };
    }>;
};
//# sourceMappingURL=chat.validation.d.ts.map