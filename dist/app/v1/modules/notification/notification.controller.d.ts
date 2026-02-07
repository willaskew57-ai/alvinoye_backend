import type { Request, Response } from 'express';
export declare const NotificationControllers: {
    getUserNotifications: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUnreadCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markAllAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteAllNotifications: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=notification.controller.d.ts.map