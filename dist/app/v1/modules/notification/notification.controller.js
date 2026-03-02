import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { NotificationServices } from './notification.service';
/**
 * @route GET /api/v1/notifications
 * @desc Get all notifications for logged-in user
 * @access Private
 */
const getUserNotifications = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const result = await NotificationServices.getUserNotificationsFromDB(userId, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
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
const getUnreadCount = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const count = await NotificationServices.getUnreadCountFromDB(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
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
const getSingleNotification = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const { id } = req.params;
    const result = await NotificationServices.getSingleNotificationFromDB(id, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
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
const markAsRead = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const { id } = req.params;
    const result = await NotificationServices.markAsReadInDB(id, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
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
const markAllAsRead = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const result = await NotificationServices.markAllAsReadInDB(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
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
const deleteNotification = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const { id } = req.params;
    await NotificationServices.deleteNotificationFromDB(id, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
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
const deleteAllNotifications = catchAsync(async (req, res) => {
    const userId = req.user?.user_id;
    const result = await NotificationServices.deleteAllNotificationsFromDB(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All notifications deleted successfully',
        data: result,
    });
});
export const NotificationControllers = {
    getUserNotifications,
    getUnreadCount,
    getSingleNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
};
//# sourceMappingURL=notification.controller.js.map