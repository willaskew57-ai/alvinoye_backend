import httpStatus from 'http-status';
import { ChatService } from './chat.service';
import { USER_ROLES } from './chat.interface';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
const initiateChat = catchAsync(async (req, res) => {
    const result = await ChatService.initiateChat(req.user.user_id, req.user.role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Support chat initiated successfully!',
        data: result,
    });
});
const initiateP2PChat = catchAsync(async (req, res) => {
    const { recipientId } = req.body;
    const result = await ChatService.initiateChat(req.user.user_id, req.user.role, recipientId // Passing the recipientId for P2P
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chat initiated successfully!',
        data: result,
    });
});
const sendMessage = catchAsync(async (req, res) => {
    const result = await ChatService.sendMessage(req.user.user_id, req.user.role, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Message sent!',
        data: result,
    });
});
const getMyChats = catchAsync(async (req, res) => {
    const result = await ChatService.getMyChats(req.user.user_id, req.user.role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chats retrieved successfully!',
        data: result,
    });
});
const getMessages = catchAsync(async (req, res) => {
    const { id } = req.params;
    // Pass both chatId and current userId to handle read receipts
    const result = await ChatService.getMessages(id, req.user.user_id, req.user.role);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages retrieved successfully!',
        data: result,
    });
});
const markAsRead = catchAsync(async (req, res) => {
    const { id } = req.params; // This is the chatId
    const userId = req.user.user_id;
    const result = await ChatService.markAsRead(id, userId);
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
//# sourceMappingURL=chat.controller.js.map