import { NOTIFICATION_TYPE } from './notification.constant';

/**
 * Notification message templates
 */
export const NotificationTemplates = {
  // Parcel Notifications
  [NOTIFICATION_TYPE.PARCEL_CREATED]: (data: any) =>
    `Your parcel "${data.parcel_name || 'delivery request'}" has been created successfully.`,

  [NOTIFICATION_TYPE.PARCEL_ACCEPTED]: (data: any) =>
    `Driver ${data.driver_name || 'has'} accepted your parcel "${data.parcel_name}".`,

  [NOTIFICATION_TYPE.PARCEL_ONGOING]: (data: any) =>
    `Your parcel "${data.parcel_name}" is now in transit.`,

  [NOTIFICATION_TYPE.PARCEL_COMPLETED]: (data: any) =>
    `Your parcel "${data.parcel_name}" has been delivered successfully!`,

  [NOTIFICATION_TYPE.PARCEL_REJECTED]: (data: any) =>
    `Your parcel "${data.parcel_name}" has been rejected. ${data.reason || ''}`,

  // Price Notifications
  [NOTIFICATION_TYPE.PRICE_PROPOSED]: (data: any) =>
    `A price of $${data.price} has been proposed for your parcel "${data.parcel_name}".`,

  [NOTIFICATION_TYPE.PRICE_ACCEPTED]: (data: any) =>
    `The price of $${data.price} for parcel "${data.parcel_name}" has been accepted.`,

  [NOTIFICATION_TYPE.PRICE_REJECTED]: (data: any) =>
    `The price proposal for parcel "${data.parcel_name}" has been rejected.`,

  [NOTIFICATION_TYPE.PRICE_COUNTERED]: (data: any) =>
    `A counter offer of $${data.price} has been made for parcel "${data.parcel_name}".`,

  // Payment Notifications
  [NOTIFICATION_TYPE.PAYMENT_SUCCESS]: (data: any) =>
    `Payment of $${data.amount} for parcel "${data.parcel_name}" was successful.`,

  [NOTIFICATION_TYPE.PAYMENT_FAILED]: (data: any) =>
    `Payment of $${data.amount} for parcel "${data.parcel_name}" failed. Please try again.`,

  // Driver Notifications
  [NOTIFICATION_TYPE.DRIVER_APPROVED]: (data: any) =>
    `Congratulations! Your driver application has been approved. You can now start accepting parcels.`,

  [NOTIFICATION_TYPE.DRIVER_REJECTED]: (data: any) =>
    `Your driver application has been rejected. ${data.reason || 'Please contact support for more information.'}`,

  // Refund Notifications
  [NOTIFICATION_TYPE.REFUND_REQUESTED]: (data: any) =>
    `A refund request of $${data.amount} has been submitted for parcel "${data.parcel_name}".`,

  [NOTIFICATION_TYPE.REFUND_APPROVED]: (data: any) =>
    `Your refund request of $${data.amount} for parcel "${data.parcel_name}" has been approved.`,

  [NOTIFICATION_TYPE.REFUND_REJECTED]: (data: any) =>
    `Your refund request for parcel "${data.parcel_name}" has been rejected. ${data.reason || ''}`,

  // Chat Notifications
  [NOTIFICATION_TYPE.NEW_MESSAGE]: (data: any) =>
    `You have a new message from ${data.sender_name || 'support'}.`,

  // System Notifications
  [NOTIFICATION_TYPE.SYSTEM]: (data: any) => data.message || 'System notification',
};

/**
 * Generate notification message from template
 */
export const generateNotificationMessage = (
  type: string,
  data: any = {}
): string => {
  const template = NotificationTemplates[type as keyof typeof NotificationTemplates];
  return template ? template(data) : 'You have a new notification';
};
