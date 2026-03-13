"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const notification_service_1 = require("./notification.service");
/**
 * @route GET /api/v1/notifications
 * @desc Get all notifications for logged-in user
 * @access Private
 */
const getUserNotifications = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const result = await notification_service_1.NotificationServices.getUserNotificationsFromDB(userId, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get unread notification count
 * @access Private
 */
const getUnreadCount = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const count = await notification_service_1.NotificationServices.getUnreadCountFromDB(userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Unread count retrieved successfully',
        data: { count },
    });
});
/**
 * @route GET /api/v1/notifications/:id
 * @desc Get single notification
 * @access Private
 */
const getSingleNotification = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const { id } = req.params;
    const result = await notification_service_1.NotificationServices.getSingleNotificationFromDB(id, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification retrieved successfully',
        data: result,
    });
});
/**
 * @route PATCH /api/v1/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
const markAsRead = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const { id } = req.params;
    const result = await notification_service_1.NotificationServices.markAsReadInDB(id, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification marked as read',
        data: result,
    });
});
/**
 * @route PATCH /api/v1/notifications/mark-all-read
 * @desc Mark all notifications as read
 * @access Private
 */
const markAllAsRead = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const result = await notification_service_1.NotificationServices.markAllAsReadInDB(userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All notifications marked as read',
        data: result,
    });
});
/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Delete a notification
 * @access Private
 */
const deleteNotification = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const { id } = req.params;
    await notification_service_1.NotificationServices.deleteNotificationFromDB(id, userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification deleted successfully',
        data: null,
    });
});
/**
 * @route DELETE /api/v1/notifications
 * @desc Delete all notifications
 * @access Private
 */
const deleteAllNotifications = (0, catch_async_1.default)(async (req, res) => {
    const userId = req.user?.user_id;
    const result = await notification_service_1.NotificationServices.deleteAllNotificationsFromDB(userId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All notifications deleted successfully',
        data: result,
    });
});
exports.NotificationControllers = {
    getUserNotifications,
    getUnreadCount,
    getSingleNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
};
//# sourceMappingURL=notification.controller.js.map