import { Schema, model } from 'mongoose';
import { USER_ROLES, } from './chat.interface';
const chatSchema = new Schema({
    participants: [
        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    participant_roles: [{ type: String, enum: Object.values(USER_ROLES) }],
    is_support_chat: { type: Boolean, default: false },
    last_message: { type: String },
    last_message_at: { type: Date },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
const messageSchema = new Schema({
    chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender_role: {
        type: String,
        enum: Object.values(USER_ROLES),
        required: true,
    },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    is_read: { type: Boolean, default: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
const messageReadSchema = new Schema({
    message_id: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    read_at: { type: Date, default: Date.now },
}, { timestamps: false });
export const Chat = model('Chat', chatSchema);
export const Message = model('Message', messageSchema);
export const MessageRead = model('MessageRead', messageReadSchema);
//# sourceMappingURL=chat.model.js.map