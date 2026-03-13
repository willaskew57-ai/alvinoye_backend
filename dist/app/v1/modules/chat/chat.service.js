"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = exports.sendMessage = void 0;
const mongoose_1 = require("mongoose");
const http_status_1 = __importDefault(require("http-status"));
const chat_model_1 = require("./chat.model");
const chat_interface_1 = require("./chat.interface");
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const socket_1 = require("../../../../socket");
const user_model_1 = __importDefault(require("../user/user.model"));
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const initiateChat = async (userId, userRole, recipientId) => {
    if (!recipientId) {
        let chat = await chat_model_1.Chat.findOne({
            participants: userId,
            is_support_chat: true,
        });
        if (!chat) {
            chat = await chat_model_1.Chat.create({
                participants: [new mongoose_1.Types.ObjectId(userId)],
                participant_roles: [userRole, chat_interface_1.USER_ROLES.ADMIN],
                is_support_chat: true,
            });
        }
        return chat;
    }
    const recipient = await user_model_1.default.findById(recipientId);
    if (!recipient)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Recipient not found');
    //  Check if a private chat already exists
    let chat = await chat_model_1.Chat.findOne({
        participants: { $all: [userId, recipientId] },
        is_support_chat: false,
    });
    if (!chat) {
        chat = await chat_model_1.Chat.create({
            participants: [
                new mongoose_1.Types.ObjectId(userId),
                new mongoose_1.Types.ObjectId(recipientId),
            ],
            participant_roles: [userRole, recipient.role],
            is_support_chat: false,
        });
    }
    return chat;
};
const sendMessage = async (senderId, senderRole, payload) => {
    const { chat_id, content, attachments } = payload;
    const chat = await chat_model_1.Chat.findById(chat_id);
    if (!chat)
        throw new Error('Chat session not found');
    let message = await chat_model_1.Message.create({
        chat_id: new mongoose_1.Types.ObjectId(chat_id),
        sender_id: new mongoose_1.Types.ObjectId(senderId),
        sender_role: senderRole,
        content: content || '',
        attachments: attachments || [],
    });
    message = await message.populate('sender_id', 'full_name profile_picture');
    // Update last message text for the sidebar
    const lastMsgText = content || (attachments?.length ? 'Sent an attachment' : '');
    const updatedChat = await chat_model_1.Chat.findByIdAndUpdate(chat_id, {
        last_message: lastMsgText,
        last_message_at: new Date(),
    }, { new: true });
    const io = (0, socket_1.getIO)();
    if (io) {
        io.to(chat_id).emit('new_message', message);
        chat.participants.forEach((id) => {
            io.to(id.toString()).emit('update_chat_list', {
                chat_id,
                last_message: lastMsgText,
                last_message_at: updatedChat?.last_message_at,
            });
        });
    }
    return message;
};
exports.sendMessage = sendMessage;
const getMyChats = async (userId, userRole, query) => {
    const isAdmin = userRole === chat_interface_1.USER_ROLES.ADMIN || userRole === chat_interface_1.USER_ROLES.SUPER_ADMIN;
    let queryFilter = isAdmin
        ? { is_support_chat: true }
        : { participants: userId };
    if (query.searchTerm) {
        const matchingUsers = await user_model_1.default.find({
            $or: [
                { full_name: { $regex: query.searchTerm, $options: 'i' } },
                { email: { $regex: query.searchTerm, $options: 'i' } },
            ],
        }).select('_id');
        const userIds = matchingUsers.map((u) => u._id);
        queryFilter = {
            ...queryFilter,
            participants: { $in: userIds },
        };
    }
    const chatQuery = new query_builder_1.default(chat_model_1.Chat.find(queryFilter).populate('participants', 'full_name email profile_picture role is_online last_active'), query)
        .filter()
        .sort()
        .paginate();
    const chats = await chatQuery.modelQuery.lean();
    const meta = await chatQuery.countTotal();
    const modifiedData = chats.map((chat) => {
        return {
            ...chat,
            participants: chat.participants.filter((participant) => participant._id.toString() !== userId),
        };
    });
    return { meta, modifiedData };
};
const getMessages = async (chatId, currentUserId, userRole, query) => {
    if (!mongoose_1.Types.ObjectId.isValid(chatId)) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Chat ID');
    }
    const chat = await chat_model_1.Chat.findById(chatId);
    if (!chat) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Chat session not found');
    }
    const isAdmin = userRole === chat_interface_1.USER_ROLES.ADMIN || userRole === chat_interface_1.USER_ROLES.SUPER_ADMIN;
    const isParticipant = chat.participants.some((id) => id.toString() === currentUserId);
    if (!isParticipant && !(isAdmin && chat.is_support_chat)) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to view this chat');
    }
    const messageQuery = new query_builder_1.default(chat_model_1.Message.find({ chat_id: chatId }).populate('sender_id', 'full_name profile_picture'), query)
        .sort()
        .paginate();
    const messages = (await messageQuery.modelQuery.lean());
    const meta = await messageQuery.countTotal();
    const unreadMessages = messages.filter((msg) => msg.sender_id._id.toString() !== currentUserId && !msg.is_read);
    if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map((msg) => msg._id);
        await chat_model_1.Message.updateMany({ _id: { $in: unreadIds } }, { $set: { is_read: true } });
        const readRecords = unreadIds.map((msgId) => ({
            message_id: msgId,
            user_id: new mongoose_1.Types.ObjectId(currentUserId),
            read_at: new Date(),
        }));
        await chat_model_1.MessageRead.insertMany(readRecords);
        const io = (0, socket_1.getIO)();
        if (io) {
            io.to(chatId).emit('messages_read', {
                chatId,
                readBy: currentUserId,
                messageIds: unreadIds,
            });
        }
        unreadMessages.forEach((msg) => {
            msg.is_read = true;
        });
    }
    return {
        meta,
        data: messages,
    };
};
const markAsRead = async (chatId, userId) => {
    await chat_model_1.Message.updateMany({ chat_id: chatId, sender_id: { $ne: userId }, is_read: false }, { $set: { is_read: true } });
    return { success: true };
};
exports.ChatService = {
    initiateChat,
    sendMessage: exports.sendMessage,
    getMyChats,
    getMessages,
    markAsRead,
};
//# sourceMappingURL=chat.service.js.map