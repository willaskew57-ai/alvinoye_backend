import httpStatus from 'http-status';
import { ChatService } from './chat.service';
import { USER_ROLES } from './chat.interface';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { getLocalFileUrl } from '../../../../utils/fileUploadHelper';
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
    const result = await ChatService.initiateChat(req.user.user_id, req.user.role, recipientId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chat initiated successfully!',
        data: result,
    });
});
export const sendMessage = catchAsync(async (req, res) => {
    let attachmentUrls = [];
    if (req.files && Array.isArray(req.files)) {
        attachmentUrls = req.files.map((file) => getLocalFileUrl(file.path));
    }
    const result = await ChatService.sendMessage(req.user.user_id, req.user.role, {
        ...req.body,
        attachments: attachmentUrls,
    });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Message sent!',
        data: result,
    });
});
const getMyChats = catchAsync(async (req, res) => {
    const result = await ChatService.getMyChats(req.user.user_id, req.user.role, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Chats retrieved successfully!',
        data: result,
    });
});
const getMessages = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ChatService.getMessages(id, req.user.user_id, req.user.role, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Messages retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
const markAsRead = catchAsync(async (req, res) => {
    const { id } = req.params;
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