import { Types } from 'mongoose';
import { USER_ROLES, type TPopulatedMessage } from './chat.interface';
export declare const ChatService: {
    initiateChat: (userId: string, userRole: USER_ROLES, recipientId?: string) => Promise<import("mongoose").Document<unknown, {}, import("./chat.interface").TChat, {}, import("mongoose").DefaultSchemaOptions> & import("./chat.interface").TChat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    sendMessage: (senderId: string, senderRole: USER_ROLES, payload: {
        chat_id: string;
        content: string;
        attachments?: string[];
    }) => Promise<import("mongoose").Document<unknown, {}, import("./chat.interface").TMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./chat.interface").TMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyChats: (userId: string, userRole: USER_ROLES, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: {
            unread_count: number;
            _id: Types.ObjectId;
            __v: number;
        }[];
    }>;
    getMessages: (chatId: string, currentUserId: string, userRole: USER_ROLES, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: TPopulatedMessage[];
    }>;
    markAsRead: (chatId: string, userId: string) => Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=chat.service.d.ts.map