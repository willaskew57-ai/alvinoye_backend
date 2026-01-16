import { Types } from 'mongoose';
import { USER_ROLES } from './chat.interface';
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
    getMyChats: (userId: string, userRole: USER_ROLES) => Promise<(import("mongoose").Document<unknown, {}, import("./chat.interface").TChat, {}, import("mongoose").DefaultSchemaOptions> & import("./chat.interface").TChat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMessages: (chatId: string, currentUserId: string, userRole: USER_ROLES) => Promise<(import("mongoose").Document<unknown, {}, import("./chat.interface").TMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./chat.interface").TMessage & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAsRead: (chatId: string, userId: string) => Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=chat.service.d.ts.map