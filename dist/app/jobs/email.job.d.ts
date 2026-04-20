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
export declare const sendRegisterEmailJob: (email: string, data: RegisterEmailPayload) => Promise<void>;
export declare const sendResendOtpEmailJob: (email: string, data: ResendOtpEmailPayload) => Promise<void>;
export declare const sendResetPasswordEmailJob: (email: string, data: ResetPasswordEmailPayload) => Promise<void>;
//# sourceMappingURL=email.job.d.ts.map