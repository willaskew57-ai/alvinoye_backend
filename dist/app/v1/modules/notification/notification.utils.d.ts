import type { TNotificationType, ICreateNotification } from './notification.interface';
/**
 * Get notification title based on type
 */
export declare const getNotificationTitle: (type: TNotificationType) => string;
/**
 * Generate action URL based on notification type
 */
export declare const generateActionUrl: (type: TNotificationType, data: Partial<ICreateNotification>) => string;
//# sourceMappingURL=notification.utils.d.ts.map