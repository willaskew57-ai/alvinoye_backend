"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActionUrl = exports.getNotificationTitle = void 0;
const notification_constant_1 = require("./notification.constant");
const getNotificationTitle = (type) => {
    const titles = {
        [notification_constant_1.NOTIFICATION_TYPE.PARCEL_CREATED]: 'Parcel Created',
        [notification_constant_1.NOTIFICATION_TYPE.PARCEL_ACCEPTED]: 'Parcel Accepted',
        [notification_constant_1.NOTIFICATION_TYPE.PARCEL_ONGOING]: 'Parcel In Transit',
        [notification_constant_1.NOTIFICATION_TYPE.PARCEL_COMPLETED]: 'Parcel Delivered',
        [notification_constant_1.NOTIFICATION_TYPE.PARCEL_REJECTED]: 'Parcel Rejected',
        [notification_constant_1.NOTIFICATION_TYPE.PRICE_PROPOSED]: 'Price Proposed',
        [notification_constant_1.NOTIFICATION_TYPE.PRICE_ACCEPTED]: 'Price Accepted',
        [notification_constant_1.NOTIFICATION_TYPE.PRICE_REJECTED]: 'Price Rejected',
        [notification_constant_1.NOTIFICATION_TYPE.PRICE_COUNTERED]: 'Price Counter Offer',
        [notification_constant_1.NOTIFICATION_TYPE.PAYMENT_SUCCESS]: 'Payment Successful',
        [notification_constant_1.NOTIFICATION_TYPE.PAYMENT_FAILED]: 'Payment Failed',
        [notification_constant_1.NOTIFICATION_TYPE.DRIVER_APPROVED]: 'Driver Approved',
        [notification_constant_1.NOTIFICATION_TYPE.DRIVER_REJECTED]: 'Driver Rejected',
        [notification_constant_1.NOTIFICATION_TYPE.REFUND_REQUESTED]: 'Refund Requested',
        [notification_constant_1.NOTIFICATION_TYPE.REFUND_APPROVED]: 'Refund Approved',
        [notification_constant_1.NOTIFICATION_TYPE.REFUND_REJECTED]: 'Refund Rejected',
        [notification_constant_1.NOTIFICATION_TYPE.NEW_MESSAGE]: 'New Message',
        [notification_constant_1.NOTIFICATION_TYPE.SYSTEM]: 'System Notification',
    };
    return titles[type] || 'Notification';
};
exports.getNotificationTitle = getNotificationTitle;
const generateActionUrl = (type, data) => {
    const baseUrl = '/';
    switch (type) {
        case notification_constant_1.NOTIFICATION_TYPE.PARCEL_CREATED:
        case notification_constant_1.NOTIFICATION_TYPE.PARCEL_ACCEPTED:
        case notification_constant_1.NOTIFICATION_TYPE.PARCEL_ONGOING:
        case notification_constant_1.NOTIFICATION_TYPE.PARCEL_COMPLETED:
        case notification_constant_1.NOTIFICATION_TYPE.PARCEL_REJECTED:
            return data.parcel_id
                ? `${baseUrl}parcels/${data.parcel_id}`
                : `${baseUrl}parcels`;
        case notification_constant_1.NOTIFICATION_TYPE.PRICE_PROPOSED:
        case notification_constant_1.NOTIFICATION_TYPE.PRICE_ACCEPTED:
        case notification_constant_1.NOTIFICATION_TYPE.PRICE_REJECTED:
        case notification_constant_1.NOTIFICATION_TYPE.PRICE_COUNTERED:
            return data.parcel_id
                ? `${baseUrl}parcels/${data.parcel_id}/pricing`
                : `${baseUrl}parcels`;
        case notification_constant_1.NOTIFICATION_TYPE.PAYMENT_SUCCESS:
        case notification_constant_1.NOTIFICATION_TYPE.PAYMENT_FAILED:
            return data.payment_id
                ? `${baseUrl}payments/${data.payment_id}`
                : `${baseUrl}payments`;
        case notification_constant_1.NOTIFICATION_TYPE.DRIVER_APPROVED:
        case notification_constant_1.NOTIFICATION_TYPE.DRIVER_REJECTED:
            return `${baseUrl}profile`;
        case notification_constant_1.NOTIFICATION_TYPE.REFUND_REQUESTED:
        case notification_constant_1.NOTIFICATION_TYPE.REFUND_APPROVED:
        case notification_constant_1.NOTIFICATION_TYPE.REFUND_REJECTED:
            return `${baseUrl}refunds`;
        case notification_constant_1.NOTIFICATION_TYPE.NEW_MESSAGE:
            return data.chat_id
                ? `${baseUrl}chats/${data.chat_id}`
                : `${baseUrl}chats`;
        default:
            return baseUrl;
    }
};
exports.generateActionUrl = generateActionUrl;
//# sourceMappingURL=notification.utils.js.map