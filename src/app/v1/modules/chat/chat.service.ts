import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { Chat, Message, MessageRead } from './chat.model';
import { USER_ROLES, type TPopulatedMessage } from './chat.interface';
import AppError from '../../../../errors/app-error';
import { getIO } from '../../../../socket';
import User from '../user/user.model';
import QueryBuilder from '../../../../builders/query-builder';

const initiateChat = async (
  userId: string,
  userRole: USER_ROLES,
  recipientId?: string
) => {
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

  const recipient = await User.findById(recipientId); // Ensure User model is imported
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
      participant_roles: [userRole, recipient.role as USER_ROLES],
      is_support_chat: false,
    });
  }
  return chat;
};

export const sendMessage = async (
  senderId: string,
  senderRole: string,
  payload: { chat_id: string; content?: string; attachments?: string[] }
) => {
  const { chat_id, content, attachments } = payload;

  const chat = await Chat.findById(chat_id);
  if (!chat) throw new Error('Chat session not found');

  // Create message - content defaults to empty string if not provided
  let message = await Message.create({
  chat_id: new Types.ObjectId(chat_id),
  sender_id: new Types.ObjectId(senderId),
  sender_role: senderRole,
  content: content || '', // Ensure this is at least an empty string
  attachments: attachments || [],
});
  message = await message.populate('sender_id', 'full_name profile_picture');

  // Update last message text for the sidebar
  const lastMsgText = content || (attachments?.length ? 'Sent an attachment' : '');

  const updatedChat = await Chat.findByIdAndUpdate(
    chat_id,
    { 
      last_message: lastMsgText, 
      last_message_at: new Date() 
    },
    { new: true }
  );

  // Socket.io emission logic...
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

const getMyChats = async (
  userId: string,
  userRole: USER_ROLES,
  query: Record<string, unknown>
) => {
  const isAdmin =
    userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;

  // 1. Base Filter based on role
  let queryFilter: any = isAdmin
    ? { is_support_chat: true }
    : { participants: userId };

  // 2. Handle Search (Search by participant name/email)
  if (query.searchTerm) {
    const matchingUsers = await User.find({
      $or: [
        { full_name: { $regex: query.searchTerm as string, $options: 'i' } },
        { email: { $regex: query.searchTerm as string, $options: 'i' } },
      ],
    } as any).select('_id');

    const userIds = matchingUsers.map((u) => u._id);

    queryFilter = {
      ...queryFilter,
      participants: { $in: userIds },
    };
  }

  // 3. Initialize QueryBuilder
  const chatQuery = new QueryBuilder(
    Chat.find(queryFilter).populate(
      'participants',
      'full_name email profile_picture role is_online last_active'
    ),
    query
  )
    .filter()
    .sort()
    .paginate();

  // 4. Execute Query
  const chats = await chatQuery.modelQuery.lean();
  const meta = await chatQuery.countTotal();

  // 5. Add Unread Count for each chat
  const data = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chat_id: chat._id,
        is_read: false,
        sender_id: { $ne: userId },
      });

      return {
        ...chat,
        unread_count: unreadCount,
      };
    })
  );

  return { meta, data };
};

const getMessages = async (
  chatId: string,
  currentUserId: string,
  userRole: USER_ROLES,
  query: Record<string, unknown>
) => {
  // 1. Validate Chat ID format
  if (!Types.ObjectId.isValid(chatId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Chat ID');
  }

  // 2. Permission Check: Verify chat existence and participant authorization
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat session not found');
  }

  const isAdmin =
    userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
  const isParticipant = chat.participants.some(
    (id) => id.toString() === currentUserId
  );

  // Allow if participant OR (Admin and it's a support chat)
  if (!isParticipant && !(isAdmin && chat.is_support_chat)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to view this chat'
    );
  }

  // 3. Build Paginated Query
  // Note: We sort by -created_at so Page 1 returns the LATEST messages
  const messageQuery = new QueryBuilder(
    Message.find({ chat_id: chatId }).populate(
      'sender_id',
      'full_name profile_picture'
    ),
    query
  )
    .sort() // Defaults to -created_at
    .paginate();

  // 4. Fetch Data with Lean (for plain objects) and Cast to our Populated Type

  const messages =
    (await messageQuery.modelQuery.lean()) as unknown as TPopulatedMessage[];
  const meta = await messageQuery.countTotal();

  // 5. Handle Read Receipts
  // Find messages received by the current user that haven't been read yet
  const unreadMessages = messages.filter(
    (msg) => msg.sender_id._id.toString() !== currentUserId && !msg.is_read
  );

  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map((msg) => msg._id);

    // Update Message status in Database
    await Message.updateMany(
      { _id: { $in: unreadIds } },
      { $set: { is_read: true } }
    );

    // Create tracking records in MessageRead collection
    const readRecords = unreadIds.map((msgId) => ({
      message_id: msgId,
      user_id: new Types.ObjectId(currentUserId),
      read_at: new Date(),
    }));
    await MessageRead.insertMany(readRecords);

    // Notify the chat room via Socket.io
    const io = getIO();
    if (io) {
      io.to(chatId).emit('messages_read', {
        chatId,
        readBy: currentUserId,
        messageIds: unreadIds,
      });
    }

    // Update local objects in the array so the current API response reflects the read status
    unreadMessages.forEach((msg) => {
      msg.is_read = true;
    });
  }

  // Returns data in [Newest -> Oldest] order based on pagination
  // Frontend should .reverse() the final combined list to display chronologically
  return {
    meta,
    data: messages,
  };
};
const markAsRead = async (chatId: string, userId: string) => {
  await Message.updateMany(
    { chat_id: chatId, sender_id: { $ne: userId }, is_read: false },
    { $set: { is_read: true } }
  );

  return { success: true };
};

export const ChatService = {
  initiateChat,
  sendMessage,
  getMyChats,
  getMessages,
  markAsRead,
};
