"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoutes = void 0;
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const auth_1 = require("../../../../middleware/auth");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const chat_validation_1 = require("./chat.validation");
const chat_interface_1 = require("./chat.interface");
const multer_s3_uploader_1 = require("../../../../aws/multer-s3-uploader");
const router = (0, express_1.Router)();
/**
 * @route POST /api/v1/chat/initiate
 * @desc Customers/Drivers initiate a support chat with Admin (As of now not needed but can be used for future support chat)
 */
router.post('/initiate-support', (0, auth_1.auth)(chat_interface_1.USER_ROLES.CUSTOMER, chat_interface_1.USER_ROLES.DRIVER), (0, validate_request_1.default)(chat_validation_1.ChatValidation.initiateChatValidationSchema), chat_controller_1.ChatController.initiateChat);
router.post('/initiate-p2p', (0, auth_1.auth)(chat_interface_1.USER_ROLES.CUSTOMER, chat_interface_1.USER_ROLES.DRIVER), (0, validate_request_1.default)(chat_validation_1.ChatValidation.initiateP2PChatValidationSchema), chat_controller_1.ChatController.initiateP2PChat);
/**
 * @route GET /api/v1/chat/my-chats
 * @desc Users see their chat; Admins see all support chats
 */
router.get('/my-chats', (0, auth_1.auth)(chat_interface_1.USER_ROLES.ADMIN, chat_interface_1.USER_ROLES.SUPER_ADMIN, chat_interface_1.USER_ROLES.CUSTOMER, chat_interface_1.USER_ROLES.DRIVER), chat_controller_1.ChatController.getMyChats);
/**
 * @route GET /api/v1/chat/messages/:id
 * @desc Get message history for a specific chat
 */
router.get('/messages/:id', (0, auth_1.auth)(), chat_controller_1.ChatController.getMessages);
/**
 * @route POST /api/v1/chat/send
 * @desc Send a message (Customer to Admin or Admin to Customer)
 */
router.post('/send', (0, auth_1.auth)(), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    // If files are sent, field values often end up in req.body.data
    if (req.body.data)
        req.body = JSON.parse(req.body.data);
    next();
}, chat_controller_1.ChatController.sendMessage);
/**
 * @route PATCH /api/v1/chat/mark-as-read/:id
 * @desc Mark all unread messages in a chat as read
 */
router.patch('/mark-as-read/:id', (0, auth_1.auth)(), chat_controller_1.ChatController.markAsRead);
exports.ChatRoutes = router;
//# sourceMappingURL=chat.routes.js.map