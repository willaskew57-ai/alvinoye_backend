import { Types } from 'mongoose';
export declare enum USER_ROLES {
    CUSTOMER = "CUSTOMER",
    DRIVER = "DRIVER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export type TChat = {
    participants: Types.ObjectId[];
    participant_roles: USER_ROLES[];
    is_support_chat: boolean;
    last_message?: string;
    last_message_at?: Date;
};
export type TMessage = {
    chat_id: Types.ObjectId;
    sender_id: Types.ObjectId;
    sender_role: USER_ROLES;
    content: string;
    attachments?: string[];
    is_read: boolean;
};
export type TMessageRead = {
    message_id: Types.ObjectId;
    user_id: Types.ObjectId;
    read_at: Date;
};
//# sourceMappingURL=chat.interface.d.ts.map