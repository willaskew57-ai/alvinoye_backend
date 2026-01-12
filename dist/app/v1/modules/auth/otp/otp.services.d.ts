import { Types } from 'mongoose';
export declare const OtpServices: {
    generateAndSaveOtp: (user_id: Types.ObjectId, purpose: "REGISTER" | "RESET_PASSWORD") => Promise<string>;
    verifyOtpFromDB: (user_id: string, inputOtp: string, purpose: "REGISTER" | "RESET_PASSWORD") => Promise<boolean>;
};
//# sourceMappingURL=otp.services.d.ts.map