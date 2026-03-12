import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { Chat, Message, MessageRead } from './chat.model';
import { USER_ROLES } from './chat.interface';
import AppError from '../../../../errors/app-error';
import { getIO } from '../../../../socket';
import User from '../user/user.model';
import QueryBuilder from '../../../../builders/query-builder';
const initiateChat = async (userId, userRole, recipientId) => {
    if (!recipientId) {
        let chat = await Chat.findOne({
            participants: userId,
            is_support_chat: true,
        });
        if (!chat) {
            chat = await Chat.create({
                participants: [new Types.ObjectId(userId)],
                participant_roles: [userRole, USER_ROLES.ADMIN],
                is_support_chat: true,
            });
        }
        return chat;
    }
    const recipient = await User.findById(recipientId);
    if (!recipient)
        throw new AppError(httpStatus.NOT_FOUND, 'Recipient not found');
    //  Check if a private chat already exists
    let chat = await Chat.findOne({
        participants: { $all: [userId, recipientId] },
        is_support_chat: false,
    });
    if (!chat) {
        chat = await Chat.create({
            participants: [
                new Types.ObjectId(userId),
                new Types.ObjectId(recipientId),
            ],
            participant_roles: [userRole, recipient.role],
            is_support_chat: false,
        });
    }
    return chat;
};
export const sendMessage = async (senderId, senderRole, payload) => {
    const { chat_id, content, attachments } = payload;
    const chat = await Chat.findById(chat_id);
    if (!chat)
        throw new Error('Chat session not found');
    let message = await Message.create({
        chat_id: new Types.ObjectId(chat_id),
        sender_id: new Types.ObjectId(senderId),
        sender_role: senderRole,
        content: content || '',
        attachments: attachments || [],
    });
    message = await message.populate('sender_id', 'full_name profile_picture');
    // Update last message text for the sidebar
    const lastMsgText = content || (attachments?.length ? 'Sent an attachment' : '');
    const updatedChat = await Chat.findByIdAndUpdate(chat_id, {
        last_message: lastMsgText,
        last_message_at: new Date(),
    }, { new: true });
    const io = getIO();
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
const getMyChats = async (userId, userRole, query) => {
    const isAdmin = userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
    let queryFilter = isAdmin
        ? { is_support_chat: true }
        : { participants: userId };
    if (query.searchTerm) {
        const matchingUsers = await User.find({
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
    const chatQuery = new QueryBuilder(Chat.find(queryFilter).populate('participants', 'full_name email profile_picture role is_online last_active'), query)
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
    if (!Types.ObjectId.isValid(chatId)) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Chat ID');
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new AppError(httpStatus.NOT_FOUND, 'Chat session not found');
    }
    const isAdmin = userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
    const isParticipant = chat.participants.some((id) => id.toString() === currentUserId);
    if (!isParticipant && !(isAdmin && chat.is_support_chat)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to view this chat');
    }
    const messageQuery = new QueryBuilder(Message.find({ chat_id: chatId }).populate('sender_id', 'full_name profile_picture'), query)
        .sort()
        .paginate();
    const messages = (await messageQuery.modelQuery.lean());
    const meta = await messageQuery.countTotal();
    const unreadMessages = messages.filter((msg) => msg.sender_id._id.toString() !== currentUserId && !msg.is_read);
    if (unreadMessages.length > 0) {
        const unreadIds = unreadMessages.map((msg) => msg._id);
        await Message.updateMany({ _id: { $in: unreadIds } }, { $set: { is_read: true } });
        const readRecords = unreadIds.map((msgId) => ({
            message_id: msgId,
            user_id: new Types.ObjectId(currentUserId),
            read_at: new Date(),
        }));
        await MessageRead.insertMany(readRecords);
        const io = getIO();
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
    await Message.updateMany({ chat_id: chatId, sender_id: { $ne: userId }, is_read: false }, { $set: { is_read: true } });
    return { success: true };
};
export const ChatService = {
    initiateChat,
    sendMessage,
    getMyChats,
    getMessages,
    markAsRead,
};
//# sourceMappingURL=chat.service.js.map