"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const notification_model_1 = require("./notification.model");
const notification_constant_1 = require("./notification.constant");
const notification_utils_1 = require("./notification.utils");
const notification_template_1 = require("./notification.template");
const socket_1 = require("../../../../socket");
const createNotificationIntoDB = async (payload) => {
    // Auto-generate title if not provided
    if (!payload.title) {
        payload.title = (0, notification_utils_1.getNotificationTitle)(payload.type);
    }
    // Auto-generate message if not provided
    if (!payload.message) {
        payload.message = (0, notification_template_1.generateNotificationMessage)(payload.type, payload.data);
    }
    // Auto-generate action URL if not provided
    if (!payload.action_url) {
        payload.action_url = (0, notification_utils_1.generateActionUrl)(payload.type, payload);
    }
    const notification = await notification_model_1.Notification.create(payload);
    // Emit real-time notification via Socket.IO
    try {
        const io = (0, socket_1.getIO)();
        io.to(payload.user_id.toString()).emit('new_notification', {
            notification: notification.toJSON(),
        });
    }
    catch (error) {
        console.error('Failed to emit notification via socket:', error);
    }
    return notification;
};
const getUserNotificationsFromDB = async (userId, query) => {
    const queryObj = { ...query, user_id: userId };
    const notificationQuery = new query_builder_1.default(notification_model_1.Notification.find()
        .populate('parcel_id', 'parcel_id parcel_name status')
        .populate('user_id', 'full_name email'), queryObj)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await notificationQuery.modelQuery;
    const meta = await notificationQuery.countTotal();
    return { meta, data };
};
const getUnreadCountFromDB = async (userId) => {
    const count = await notification_model_1.Notification.countDocuments({
        user_id: userId,
        status: notification_constant_1.NOTIFICATION_STATUS.UNREAD,
    });
    return count;
};
const markAsReadInDB = async (notificationId, userId) => {
    const notification = await notification_model_1.Notification.findOneAndUpdate({ _id: notificationId, user_id: userId }, {
        status: notification_constant_1.NOTIFICATION_STATUS.READ,
        read_at: new Date(),
    }, { new: true });
    if (!notification) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Notification not found');
    }
    return notification;
};
const markAllAsReadInDB = async (userId) => {
    const result = await notification_model_1.Notification.updateMany({ user_id: userId, status: notification_constant_1.NOTIFICATION_STATUS.UNREAD }, {
        status: notification_constant_1.NOTIFICATION_STATUS.READ,
        read_at: new Date(),
    });
    return result;
};
const deleteNotificationFromDB = async (notificationId, userId) => {
    const result = await notification_model_1.Notification.findOneAndDelete({
        _id: notificationId,
        user_id: userId,
    });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Notification not found');
    }
};
const deleteAllNotificationsFromDB = async (userId) => {
    const result = await notification_model_1.Notification.deleteMany({ user_id: userId });
    return result;
};
const getSingleNotificationFromDB = async (notificationId, userId) => {
    const notification = await notification_model_1.Notification.findOne({
        _id: notificationId,
        user_id: userId,
    })
        .populate('parcel_id', 'parcel_id parcel_name status')
        .populate('user_id', 'full_name email');
    if (!notification) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Notification not found');
    }
    return notification;
};
exports.NotificationServices = {
    createNotificationIntoDB,
    getUserNotificationsFromDB,
    getUnreadCountFromDB,
    markAsReadInDB,
    markAllAsReadInDB,
    deleteNotificationFromDB,
    deleteAllNotificationsFromDB,
    getSingleNotificationFromDB,
};
//# sourceMappingURL=notification.service.js.map