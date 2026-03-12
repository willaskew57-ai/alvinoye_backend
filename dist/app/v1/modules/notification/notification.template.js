import { NOTIFICATION_TYPE } from './notification.constant';
export const NotificationTemplates = {
    [NOTIFICATION_TYPE.PARCEL_CREATED]: (data) => `Your parcel "${data.parcel_name || 'delivery request'}" has been created successfully.`,
    [NOTIFICATION_TYPE.PARCEL_ACCEPTED]: (data) => `Driver ${data.driver_name || 'has'} accepted your parcel "${data.parcel_name}".`,
    [NOTIFICATION_TYPE.PARCEL_ONGOING]: (data) => `Your parcel "${data.parcel_name}" is now in transit.`,
    [NOTIFICATION_TYPE.PARCEL_COMPLETED]: (data) => `Your parcel "${data.parcel_name}" has been delivered successfully!`,
    [NOTIFICATION_TYPE.PARCEL_REJECTED]: (data) => `Your parcel "${data.parcel_name}" has been rejected. ${data.reason || ''}`,
    [NOTIFICATION_TYPE.PRICE_PROPOSED]: (data) => `A price of $${data.price} has been proposed for your parcel "${data.parcel_name}".`,
    [NOTIFICATION_TYPE.PRICE_ACCEPTED]: (data) => `The price of $${data.price} for parcel "${data.parcel_name}" has been accepted.`,
    [NOTIFICATION_TYPE.PRICE_REJECTED]: (data) => `The price proposal for parcel "${data.parcel_name}" has been rejected.`,
    [NOTIFICATION_TYPE.PRICE_COUNTERED]: (data) => `A counter offer of $${data.price} has been made for parcel "${data.parcel_name}".`,
    [NOTIFICATION_TYPE.PAYMENT_SUCCESS]: (data) => `Payment of $${data.amount} for parcel "${data.parcel_name}" was successful.`,
    [NOTIFICATION_TYPE.PAYMENT_FAILED]: (data) => `Payment of $${data.amount} for parcel "${data.parcel_name}" failed. Please try again.`,
    [NOTIFICATION_TYPE.DRIVER_APPROVED]: (data) => `Congratulations! Your driver application has been approved. You can now start accepting parcels.`,
    [NOTIFICATION_TYPE.DRIVER_REJECTED]: (data) => `Your driver application has been rejected. ${data.reason || 'Please contact support for more information.'}`,
    [NOTIFICATION_TYPE.REFUND_REQUESTED]: (data) => `A refund request of $${data.amount} has been submitted for parcel "${data.parcel_name}".`,
    [NOTIFICATION_TYPE.REFUND_APPROVED]: (data) => `Your refund request of $${data.amount} for parcel "${data.parcel_name}" has been approved.`,
    [NOTIFICATION_TYPE.REFUND_REJECTED]: (data) => `Your refund request for parcel "${data.parcel_name}" has been rejected. ${data.reason || ''}`,
    [NOTIFICATION_TYPE.NEW_MESSAGE]: (data) => `You have a new message from ${data.sender_name || 'support'}.`,
    [NOTIFICATION_TYPE.SYSTEM]: (data) => data.message || 'System notification',
};
export const generateNotificationMessage = (type, data = {}) => {
    const template = NotificationTemplates[type];
    return template ? template(data) : 'You have a new notification';
};
//# sourceMappingURL=notification.template.js.map