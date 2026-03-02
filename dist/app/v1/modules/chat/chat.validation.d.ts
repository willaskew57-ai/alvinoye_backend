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
            content: z.ZodOptional<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            chat_id: string;
            content?: string | undefined;
            attachments?: string[] | undefined;
        }, {
            chat_id: string;
            content?: string | undefined;
            attachments?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            chat_id: string;
            content?: string | undefined;
            attachments?: string[] | undefined;
        };
    }, {
        body: {
            chat_id: string;
            content?: string | undefined;
            attachments?: string[] | undefined;
        };
    }>;
};
//# sourceMappingURL=chat.validation.d.ts.map