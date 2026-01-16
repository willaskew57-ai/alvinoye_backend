import { Router } from 'express';
import { ChatController } from './chat.controller';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { ChatValidation } from './chat.validation';
import { USER_ROLES } from './chat.interface';

const router = Router();

/**
 * @route POST /api/v1/chat/initiate
 * @desc Customers/Drivers initiate a support chat with Admin
 */
router.post(
  '/initiate-support',
  auth(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER),
  validateRequest(ChatValidation.initiateChatValidationSchema),
  ChatController.initiateChat
);

router.post(
  '/initiate-p2p',
  auth(USER_ROLES.CUSTOMER, USER_ROLES.DRIVER),
  validateRequest(ChatValidation.initiateP2PChatValidationSchema),
  ChatController.initiateP2PChat
);

/**
 * @route GET /api/v1/chat/my-chats
 * @desc Users see their chat; Admins see all support chats
 */
router.get(
  '/my-chats',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.CUSTOMER,
    USER_ROLES.DRIVER
  ),
  ChatController.getMyChats
);

/**
 * @route GET /api/v1/chat/messages/:id
 * @desc Get message history for a specific chat
 */
router.get(
  '/messages/:id',
  auth(), // All authenticated roles can access their relevant messages
  ChatController.getMessages
);

/**
 * @route POST /api/v1/chat/send
 * @desc Send a message (Customer to Admin or Admin to Customer)
 */
router.post(
  '/send',
  auth(),
  validateRequest(ChatValidation.sendMessageValidationSchema),
  ChatController.sendMessage
);

/**
 * @route PATCH /api/v1/chat/mark-as-read/:id
 * @desc Mark all unread messages in a chat as read
 */
router.patch(
  '/mark-as-read/:id',
  auth(), // Any logged in participant can mark their received messages as read
  ChatController.markAsRead
);

export const ChatRoutes = router;
