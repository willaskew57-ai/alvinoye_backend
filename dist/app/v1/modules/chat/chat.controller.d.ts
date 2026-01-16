import type { Request, Response } from 'express';
export declare const ChatController: {
    initiateChat: (req: Request, res: Response, next: import("express").NextFunction) => void;
    initiateP2PChat: (req: Request, res: Response, next: import("express").NextFunction) => void;
    sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMyChats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMessages: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=chat.controller.d.ts.map