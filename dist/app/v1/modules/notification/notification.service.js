import httpStatus from 'http-status';
import QueryBuilder from '../../../../builders/query-builder';
import AppError from '../../../../errors/app-error';
import { Notification } from './notification.model';
import { NOTIFICATION_STATUS } from './notification.constant';
import { getNotificationTitle, generateActionUrl, } from './notification.utils';
import { generateNotificationMessage } from './notification.template';
import { getIO } from '../../../../socket';
const createNotificationIntoDB = async (payload) => {
    // Auto-generate title if not provided
    if (!payload.title) {
        payload.title = getNotificationTitle(payload.type);
    }
    // Auto-generate message if not provided
    if (!payload.message) {
        payload.message = generateNotificationMessage(payload.type, payload.data);
    }
    // Auto-generate action URL if not provided
    if (!payload.action_url) {
        payload.action_url = generateActionUrl(payload.type, payload);
    }
    const notification = await Notification.create(payload);
    // Emit real-time notification via Socket.IO
    try {
        const io = getIO();
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
    const notificationQuery = new QueryBuilder(Notification.find()
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
    const count = await Notification.countDocuments({
        user_id: userId,
        status: NOTIFICATION_STATUS.UNREAD,
    });
    return count;
};
const markAsReadInDB = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate({ _id: notificationId, user_id: userId }, {
        status: NOTIFICATION_STATUS.READ,
        read_at: new Date(),
    }, { new: true });
    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    return notification;
};
const markAllAsReadInDB = async (userId) => {
    const result = await Notification.updateMany({ user_id: userId, status: NOTIFICATION_STATUS.UNREAD }, {
        status: NOTIFICATION_STATUS.READ,
        read_at: new Date(),
    });
    return result;
};
const deleteNotificationFromDB = async (notificationId, userId) => {
    const result = await Notification.findOneAndDelete({
        _id: notificationId,
        user_id: userId,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }
};
const deleteAllNotificationsFromDB = async (userId) => {
    const result = await Notification.deleteMany({ user_id: userId });
    return result;
};
const getSingleNotificationFromDB = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        user_id: userId,
    })
        .populate('parcel_id', 'parcel_id parcel_name status')
        .populate('user_id', 'full_name email');
    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    return notification;
};
export const NotificationServices = {
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