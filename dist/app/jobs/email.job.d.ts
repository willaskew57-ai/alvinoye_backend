export interface RegisterEmailPayload {
    email: string;
    userName: string;
    otp: string;
    expiry: number;
}
export interface ResendOtpEmailPayload {
    email: string;
    userName: string;
    otp: string;
    expiry: number;
}
export interface ResetPasswordEmailPayload {
    email: string;
    userName: string;
    otp: string;
    expiry: number;
}
export interface ParcelOtpEmailPayload {
    email: string;
    name: string;
    verificationCode: string;
}
export declare const sendRegisterEmailJob: (email: string, data: RegisterEmailPayload) => Promise<void>;
export declare const sendResendOtpEmailJob: (email: string, data: ResendOtpEmailPayload) => Promise<void>;
export declare const sendResetPasswordEmailJob: (email: string, data: ResetPasswordEmailPayload) => Promise<void>;
export declare const sendParcelOtpEmailJob: (email: string, data: ParcelOtpEmailPayload) => Promise<void>;
//# sourceMappingURL=email.job.d.ts.map