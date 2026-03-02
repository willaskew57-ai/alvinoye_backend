import { Types } from 'mongoose';
type TOtpPurpose = 'REGISTER' | 'RESET_PASSWORD' | 'PARCEL';
export declare const OtpServices: {
    generateAndSaveOtp: (payload: {
        user_id?: Types.ObjectId;
        parcel_id?: Types.ObjectId;
        purpose: TOtpPurpose;
    }) => Promise<string>;
    verifyOtpFromDB: (payload: {
        user_id?: string;
        parcel_id?: string;
        inputOtp: string;
        purpose: TOtpPurpose;
    }) => Promise<boolean>;
};
export {};
//# sourceMappingURL=otp.services.d.ts.map