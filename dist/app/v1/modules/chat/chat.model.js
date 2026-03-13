"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRead = exports.Message = exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const chat_interface_1 = require("./chat.interface");
const chatSchema = new mongoose_1.Schema({
    participants: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    participant_roles: [{ type: String, enum: Object.values(chat_interface_1.USER_ROLES) }],
    is_support_chat: { type: Boolean, default: false },
    last_message: { type: String },
    last_message_at: { type: Date },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
const messageSchema = new mongoose_1.Schema({
    chat_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    sender_role: { type: String, required: true },
    // CHANGE THIS: 
    // Remove 'required: true' and add 'default: ""'
    content: {
        type: String,
        required: false, // Explicitly set to false
        default: "" // This ensures it saves an empty string instead of null
    },
    attachments: {
        type: [String],
        default: []
    },
}, { timestamps: true });
const messageReadSchema = new mongoose_1.Schema({
    message_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message', required: true },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    read_at: { type: Date, default: Date.now },
}, { timestamps: false });
exports.Chat = (0, mongoose_1.model)('Chat', chatSchema);
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
exports.MessageRead = (0, mongoose_1.model)('MessageRead', messageReadSchema);
//# sourceMappingURL=chat.model.js.map