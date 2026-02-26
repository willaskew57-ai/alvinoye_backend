import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ChatService } from './chat.service';
import { USER_ROLES } from './chat.interface';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { getLocalFileUrl } from '../../../../utils/fileUploadHelper';

const initiateChat = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.initiateChat(
    req.user.user_id,
    req.user.role as USER_ROLES
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Support chat initiated successfully!',
    data: result,
  });
});

const initiateP2PChat = catchAsync(async (req: Request, res: Response) => {
  const { recipientId } = req.body;

  const result = await ChatService.initiateChat(
    req.user.user_id,
    req.user.role as USER_ROLES,
    recipientId // Passing the recipientId for P2P
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chat initiated successfully!',
    data: result,
  });
});

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  // 1. Process attachments
  let attachmentUrls: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    attachmentUrls = (req.files as Express.Multer.File[]).map((file) =>
      getLocalFileUrl(file.path)
    );
  }

  // 2. Call service
  const result = await ChatService.sendMessage(
    req.user.user_id,
    req.user.role,
    {
      ...req.body,
      attachments: attachmentUrls,
    }
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Message sent!',
    data: result,
  });
});

const getMyChats = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.getMyChats(
    req.user.user_id,
    req.user.role as USER_ROLES,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chats retrieved successfully!',
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Pass req.query to enable pagination (e.g., ?page=1&limit=20)
  const result = await ChatService.getMessages(
    id as string,
    req.user.user_id,
    req.user.role as USER_ROLES,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // This is the chatId
  const userId = req.user.user_id;

  const result = await ChatService.markAsRead(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages marked as read successfully!',
    data: result,
  });
});

export const ChatController = {
  initiateChat,
  initiateP2PChat,
  sendMessage,
  getMyChats,
  getMessages,
  markAsRead,
};
