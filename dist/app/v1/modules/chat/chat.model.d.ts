import { type TChat, type TMessage, type TMessageRead } from './chat.interface';
export declare const Chat: import("mongoose").Model<TChat, {}, {}, {}, import("mongoose").Document<unknown, {}, TChat, {}, import("mongoose").DefaultSchemaOptions> & TChat & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TChat>;
export declare const Message: import("mongoose").Model<TMessage, {}, {}, {}, import("mongoose").Document<unknown, {}, TMessage, {}, import("mongoose").DefaultSchemaOptions> & TMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TMessage>;
export declare const MessageRead: import("mongoose").Model<TMessageRead, {}, {}, {}, import("mongoose").Document<unknown, {}, TMessageRead, {}, import("mongoose").DefaultSchemaOptions> & TMessageRead & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TMessageRead>;
//# sourceMappingURL=chat.model.d.ts.map