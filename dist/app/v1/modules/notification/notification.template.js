"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNotificationMessage = exports.NotificationTemplates = void 0;
const notification_constant_1 = require("./notification.constant");
exports.NotificationTemplates = {
    [notification_constant_1.NOTIFICATION_TYPE.PARCEL_CREATED]: (data) => `Your parcel "${data.parcel_name || 'delivery request'}" has been created successfully.`,
    [notification_constant_1.NOTIFICATION_TYPE.PARCEL_ACCEPTED]: (data) => `Driver ${data.driver_name || 'has'} accepted your parcel "${data.parcel_name}".`,
    [notification_constant_1.NOTIFICATION_TYPE.PARCEL_ONGOING]: (data) => `Your parcel "${data.parcel_name}" is now in transit.`,
    [notification_constant_1.NOTIFICATION_TYPE.PARCEL_COMPLETED]: (data) => `Your parcel "${data.parcel_name}" has been delivered successfully!`,
    [notification_constant_1.NOTIFICATION_TYPE.PARCEL_REJECTED]: (data) => `Your parcel "${data.parcel_name}" has been rejected. ${data.reason || ''}`,
    [notification_constant_1.NOTIFICATION_TYPE.PRICE_PROPOSED]: (data) => `A price of $${data.price} has been proposed for your parcel "${data.parcel_name}".`,
    [notification_constant_1.NOTIFICATION_TYPE.PRICE_ACCEPTED]: (data) => `The price of $${data.price} for parcel "${data.parcel_name}" has been accepted.`,
    [notification_constant_1.NOTIFICATION_TYPE.PRICE_REJECTED]: (data) => `The price proposal for parcel "${data.parcel_name}" has been rejected.`,
    [notification_constant_1.NOTIFICATION_TYPE.PRICE_COUNTERED]: (data) => `A counter offer of $${data.price} has been made for parcel "${data.parcel_name}".`,
    [notification_constant_1.NOTIFICATION_TYPE.PAYMENT_SUCCESS]: (data) => `Payment of $${data.amount} for parcel "${data.parcel_name}" was successful.`,
    [notification_constant_1.NOTIFICATION_TYPE.PAYMENT_FAILED]: (data) => `Payment of $${data.amount} for parcel "${data.parcel_name}" failed. Please try again.`,
    [notification_constant_1.NOTIFICATION_TYPE.DRIVER_APPROVED]: (data) => `Congratulations! Your driver application has been approved. You can now start accepting parcels.`,
    [notification_constant_1.NOTIFICATION_TYPE.DRIVER_REJECTED]: (data) => `Your driver application has been rejected. ${data.reason || 'Please contact support for more information.'}`,
    [notification_constant_1.NOTIFICATION_TYPE.REFUND_REQUESTED]: (data) => `A refund request of $${data.amount} has been submitted for parcel "${data.parcel_name}".`,
    [notification_constant_1.NOTIFICATION_TYPE.REFUND_APPROVED]: (data) => `Your refund request of $${data.amount} for parcel "${data.parcel_name}" has been approved.`,
    [notification_constant_1.NOTIFICATION_TYPE.REFUND_REJECTED]: (data) => `Your refund request for parcel "${data.parcel_name}" has been rejected. ${data.reason || ''}`,
    [notification_constant_1.NOTIFICATION_TYPE.NEW_MESSAGE]: (data) => `You have a new message from ${data.sender_name || 'support'}.`,
    [notification_constant_1.NOTIFICATION_TYPE.SYSTEM]: (data) => data.message || 'System notification',
};
const generateNotificationMessage = (type, data = {}) => {
    const template = exports.NotificationTemplates[type];
    return template ? template(data) : 'You have a new notification';
};
exports.generateNotificationMessage = generateNotificationMessage;
//# sourceMappingURL=notification.template.js.map