"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = exports.sendMessage = void 0;
const http_status_1 = __importDefault(require("http-status"));
const chat_service_1 = require("./chat.service");
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const fileUploadHelper_1 = require("../../../../utils/fileUploadHelper");
const initiateChat = (0, catch_async_1.default)(async (req, res) => {
    const result = await chat_service_1.ChatService.initiateChat(req.user.user_id, req.user.role);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Support chat initiated successfully!',
        data: result,
    });
});
const initiateP2PChat = (0, catch_async_1.default)(async (req, res) => {
    const { recipientId } = req.body;
    const result = await chat_service_1.ChatService.initiateChat(req.user.user_id, req.user.role, recipientId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Chat initiated successfully!',
        data: result,
    });
});
exports.sendMessage = (0, catch_async_1.default)(async (req, res) => {
    let attachmentUrls = [];
    if (req.files && Array.isArray(req.files)) {
        attachmentUrls = req.files.map((file) => (0, fileUploadHelper_1.getLocalFileUrl)(file.path));
    }
    const result = await chat_service_1.ChatService.sendMessage(req.user.user_id, req.user.role, {
        ...req.body,
        attachments: attachmentUrls,
    });
    (0, send_response_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Message sent!',
        data: result,
    });
});
const getMyChats = (0, catch_async_1.default)(async (req, res) => {
    const result = await chat_service_1.ChatService.getMyChats(req.user.user_id, req.user.role, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Chats retrieved successfully!',
        data: result,
    });
});
const getMessages = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await chat_service_1.ChatService.getMessages(id, req.user.user_id, req.user.role, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Messages retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
const markAsRead = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;
    const result = await chat_service_1.ChatService.markAsRead(id, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Messages marked as read successfully!',
        data: result,
    });
});
exports.ChatController = {
    initiateChat,
    initiateP2PChat,
    sendMessage: exports.sendMessage,
    getMyChats,
    getMessages,
    markAsRead,
};
//# sourceMappingURL=chat.controller.js.map