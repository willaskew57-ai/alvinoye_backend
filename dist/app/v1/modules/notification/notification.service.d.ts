import type { ICreateNotification, TNotification } from './notification.interface';
export declare const NotificationServices: {
    createNotificationIntoDB: (payload: ICreateNotification) => Promise<TNotification>;
    getUserNotificationsFromDB: (userId: string, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (import("mongoose").Document<unknown, {}, TNotification, {}, import("mongoose").DefaultSchemaOptions> & TNotification & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getUnreadCountFromDB: (userId: string) => Promise<number>;
    markAsReadInDB: (notificationId: string, userId: string) => Promise<TNotification>;
    markAllAsReadInDB: (userId: string) => Promise<import("mongoose").UpdateWriteOpResult>;
    deleteNotificationFromDB: (notificationId: string, userId: string) => Promise<void>;
    deleteAllNotificationsFromDB: (userId: string) => Promise<import("mongodb").DeleteResult>;
    getSingleNotificationFromDB: (notificationId: string, userId: string) => Promise<TNotification>;
};
//# sourceMappingURL=notification.service.d.ts.map