import type { Request, Response } from 'express';
export declare const DriverController: {
    registerDriver: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateDriverInfo: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllDrivers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleDriver: (req: Request, res: Response, next: import("express").NextFunction) => void;
    acceptParcel: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyParcelOtp: (req: Request, res: Response, next: import("express").NextFunction) => void;
    completeParcel: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAvailableParcelsForDriver: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getDriverById: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=driver.controller.d.ts.map