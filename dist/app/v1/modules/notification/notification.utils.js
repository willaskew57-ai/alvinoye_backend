import { NOTIFICATION_TYPE } from './notification.constant';
/**
 * Get notification title based on type
 */
export const getNotificationTitle = (type) => {
    const titles = {
        [NOTIFICATION_TYPE.PARCEL_CREATED]: 'Parcel Created',
        [NOTIFICATION_TYPE.PARCEL_ACCEPTED]: 'Parcel Accepted',
        [NOTIFICATION_TYPE.PARCEL_ONGOING]: 'Parcel In Transit',
        [NOTIFICATION_TYPE.PARCEL_COMPLETED]: 'Parcel Delivered',
        [NOTIFICATION_TYPE.PARCEL_REJECTED]: 'Parcel Rejected',
        [NOTIFICATION_TYPE.PRICE_PROPOSED]: 'Price Proposed',
        [NOTIFICATION_TYPE.PRICE_ACCEPTED]: 'Price Accepted',
        [NOTIFICATION_TYPE.PRICE_REJECTED]: 'Price Rejected',
        [NOTIFICATION_TYPE.PRICE_COUNTERED]: 'Price Counter Offer',
        [NOTIFICATION_TYPE.PAYMENT_SUCCESS]: 'Payment Successful',
        [NOTIFICATION_TYPE.PAYMENT_FAILED]: 'Payment Failed',
        [NOTIFICATION_TYPE.DRIVER_APPROVED]: 'Driver Approved',
        [NOTIFICATION_TYPE.DRIVER_REJECTED]: 'Driver Rejected',
        [NOTIFICATION_TYPE.REFUND_REQUESTED]: 'Refund Requested',
        [NOTIFICATION_TYPE.REFUND_APPROVED]: 'Refund Approved',
        [NOTIFICATION_TYPE.REFUND_REJECTED]: 'Refund Rejected',
        [NOTIFICATION_TYPE.NEW_MESSAGE]: 'New Message',
        [NOTIFICATION_TYPE.SYSTEM]: 'System Notification',
    };
    return titles[type] || 'Notification';
};
/**
 * Generate action URL based on notification type
 */
export const generateActionUrl = (type, data) => {
    const baseUrl = '/';
    switch (type) {
        case NOTIFICATION_TYPE.PARCEL_CREATED:
        case NOTIFICATION_TYPE.PARCEL_ACCEPTED:
        case NOTIFICATION_TYPE.PARCEL_ONGOING:
        case NOTIFICATION_TYPE.PARCEL_COMPLETED:
        case NOTIFICATION_TYPE.PARCEL_REJECTED:
            return data.parcel_id
                ? `${baseUrl}parcels/${data.parcel_id}`
                : `${baseUrl}parcels`;
        case NOTIFICATION_TYPE.PRICE_PROPOSED:
        case NOTIFICATION_TYPE.PRICE_ACCEPTED:
        case NOTIFICATION_TYPE.PRICE_REJECTED:
        case NOTIFICATION_TYPE.PRICE_COUNTERED:
            return data.parcel_id
                ? `${baseUrl}parcels/${data.parcel_id}/pricing`
                : `${baseUrl}parcels`;
        case NOTIFICATION_TYPE.PAYMENT_SUCCESS:
        case NOTIFICATION_TYPE.PAYMENT_FAILED:
            return data.payment_id
                ? `${baseUrl}payments/${data.payment_id}`
                : `${baseUrl}payments`;
        case NOTIFICATION_TYPE.DRIVER_APPROVED:
        case NOTIFICATION_TYPE.DRIVER_REJECTED:
            return `${baseUrl}profile`;
        case NOTIFICATION_TYPE.REFUND_REQUESTED:
        case NOTIFICATION_TYPE.REFUND_APPROVED:
        case NOTIFICATION_TYPE.REFUND_REJECTED:
            return `${baseUrl}refunds`;
        case NOTIFICATION_TYPE.NEW_MESSAGE:
            return data.chat_id
                ? `${baseUrl}chats/${data.chat_id}`
                : `${baseUrl}chats`;
        default:
            return baseUrl;
    }
};
//# sourceMappingURL=notification.utils.js.map