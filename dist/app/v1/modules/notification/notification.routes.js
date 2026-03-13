"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../../middleware/auth");
const notification_controller_1 = require("./notification.controller");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
/**
 * @route GET /api/v1/notifications
 * @desc Get all notifications for logged-in user
 * @access Private - All authenticated users
 */
router.get('/get-all', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.getUserNotifications);
/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get unread notification count
 * @access Private - All authenticated users
 */
router.get('/unread-count', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.getUnreadCount);
/**
 * @route PATCH /api/v1/notifications/mark-all-read
 * @desc Mark all notifications as read
 * @access Private - All authenticated users
 */
router.patch('/mark-all-read', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.markAllAsRead);
/**
 * @route DELETE /api/v1/notifications
 * @desc Delete all notifications
 * @access Private - All authenticated users
 */
router.delete('/', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.deleteAllNotifications);
/**
 * @route GET /api/v1/notifications/:id
 * @desc Get single notification
 * @access Private - All authenticated users
 */
router.get('/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.getSingleNotification);
/**
 * @route PATCH /api/v1/notifications/:id/read
 * @desc Mark notification as read
 * @access Private - All authenticated users
 */
router.patch('/:id/read', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.markAsRead);
/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Delete a notification
 * @access Private - All authenticated users
 */
router.delete('/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), notification_controller_1.NotificationControllers.deleteNotification);
exports.NotificationRoutes = router;
//# sourceMappingURL=notification.routes.js.map