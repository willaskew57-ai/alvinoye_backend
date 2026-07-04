import type { Request, Response } from 'express';
export declare const WalletController: {
    getMyWallet: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMyTransactions: (req: Request, res: Response, next: import("express").NextFunction) => void;
    withdraw: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMyWithdrawals: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllWithdrawals: (req: Request, res: Response, next: import("express").NextFunction) => void;
    retryPayout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCommission: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCommission: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=wallet.controller.d.ts.map