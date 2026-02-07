/**
 * Notification message templates
 */
export declare const NotificationTemplates: {
    PARCEL_CREATED: (data: any) => string;
    PARCEL_ACCEPTED: (data: any) => string;
    PARCEL_ONGOING: (data: any) => string;
    PARCEL_COMPLETED: (data: any) => string;
    PARCEL_REJECTED: (data: any) => string;
    PRICE_PROPOSED: (data: any) => string;
    PRICE_ACCEPTED: (data: any) => string;
    PRICE_REJECTED: (data: any) => string;
    PRICE_COUNTERED: (data: any) => string;
    PAYMENT_SUCCESS: (data: any) => string;
    PAYMENT_FAILED: (data: any) => string;
    DRIVER_APPROVED: (data: any) => string;
    DRIVER_REJECTED: (data: any) => string;
    REFUND_REQUESTED: (data: any) => string;
    REFUND_APPROVED: (data: any) => string;
    REFUND_REJECTED: (data: any) => string;
    NEW_MESSAGE: (data: any) => string;
    SYSTEM: (data: any) => any;
};
/**
 * Generate notification message from template
 */
export declare const generateNotificationMessage: (type: string, data?: any) => string;
//# sourceMappingURL=notification.template.d.ts.map