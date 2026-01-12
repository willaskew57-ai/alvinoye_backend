import { Types } from 'mongoose';
export declare const OtpServices: {
    generateAndSaveOtp: (userId: Types.ObjectId, purpose: "REGISTER" | "RESET_PASSWORD") => Promise<string>;
    verifyOtpFromDB: (userId: string, inputOtp: string, purpose: "REGISTER" | "RESET_PASSWORD") => Promise<boolean>;
};
//# sourceMappingURL=otp.services.d.ts.map