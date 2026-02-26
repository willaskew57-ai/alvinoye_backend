import { Schema, model } from 'mongoose';
import {
  USER_ROLES,
  type TChat,
  type TMessage,
  type TMessageRead,
} from './chat.interface';

const chatSchema = new Schema<TChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    participant_roles: [{ type: String, enum: Object.values(USER_ROLES) }],
    is_support_chat: { type: Boolean, default: false },
    last_message: { type: String },
    last_message_at: { type: Date },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  },
);

const messageSchema = new Schema(
  {
    chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender_role: { type: String, required: true },
    
    // CHANGE THIS: 
    // Remove 'required: true' and add 'default: ""'
    content: { 
      type: String, 
      required: false, // Explicitly set to false
      default: ""      // This ensures it saves an empty string instead of null
    },
    
    attachments: { 
      type: [String], 
      default: [] 
    },
  },
  { timestamps: true }
);

const messageReadSchema = new Schema<TMessageRead>(
  {
    message_id: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    read_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Chat = model<TChat>('Chat', chatSchema);
export const Message = model<TMessage>('Message', messageSchema);
export const MessageRead = model<TMessageRead>(
  'MessageRead',
  messageReadSchema
);
