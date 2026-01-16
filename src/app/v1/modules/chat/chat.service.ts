import { Types } from 'mongoose';
import httpStatus from 'http-status';
import { Chat, Message, MessageRead } from './chat.model';
import { USER_ROLES } from './chat.interface';
import AppError from '../../../../errors/app-error';
import { getIO } from '../../../../socket';
import User from '../user/user.model';

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

const sendMessage = async (
  senderId: string,
  senderRole: USER_ROLES,
  payload: { chat_id: string; content: string; attachments?: string[] }
) => {
  const { chat_id, content, attachments } = payload;

  const chat = await Chat.findById(chat_id);
  if (!chat) throw new AppError(httpStatus.NOT_FOUND, 'Chat session not found');

  const isAdmin =
    senderRole === USER_ROLES.ADMIN || senderRole === USER_ROLES.SUPER_ADMIN;

  if (
    isAdmin &&
    !chat.participants.includes(new Types.ObjectId(senderId) as any)
  ) {
    await Chat.findByIdAndUpdate(chat_id, {
      $addToSet: { participants: new Types.ObjectId(senderId) },
    });
  }

  const message = await Message.create({
    chat_id: new Types.ObjectId(chat_id),
    sender_id: new Types.ObjectId(senderId),
    sender_role: senderRole,
    content,
    attachments: attachments || [],
  });

  await Chat.findByIdAndUpdate(chat_id, {
    last_message: content,
    last_message_at: new Date(),
  });

  // Socket.io Real-time logic
  const io = getIO();
  if (io) {

    console.log('Emitting new_message to room:', chat_id);
    // Notify the specific room
    // io.to(chat_id).emit('new_message', message);
    io.emit('new_message', message);

    // If customer sends a message, alert all admins in the global admin room
    if (!isAdmin) {
      io.to('admin_support_room').emit('support_notification', {
        chat_id,
        sender_name: 'User Support Request',
        content,
      });
    }
  }

  return message;
};

const getMyChats = async (userId: string, userRole: USER_ROLES) => {
  
  if (userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN) {
    return await Chat.find({
      is_support_chat: true,
    })
      .populate('participants', 'name email profile_image')
      .sort({ last_message_at: -1 }); // Newest activity at the top
  }

  
  return await Chat.find({
    participants: userId,
  })
    .populate('participants', 'name email profile_image')
    .sort({ last_message_at: -1 });
};

const getMessages = async (
  chatId: string,
  currentUserId: string,
  userRole: USER_ROLES
) => {
  
  if (!Types.ObjectId.isValid(chatId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Chat ID');
  }

 
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chat session not found');
  }

  
  const isAdmin =
    userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPER_ADMIN;
  const isParticipant = chat.participants.some(
    (id) => id.toString() === currentUserId
  );


  if (!isParticipant && !(isAdmin && chat.is_support_chat)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to view this chat'
    );
  }


  const messages = await Message.find({ chat_id: chatId })
    .populate('sender_id', 'name profile_image')
    .sort({ createdAt: 1 });

  
  const unreadMessages = messages.filter(
    (msg) => msg.sender_id._id.toString() !== currentUserId && !msg.is_read
  );

  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map((msg) => msg._id);

   
    await Message.updateMany(
      { _id: { $in: unreadIds } },
      { $set: { is_read: true } }
    );

    
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
  }

  return messages;
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
  markAsRead
};
