interface IOTPData {
    user: string;
    code?: string;
    activationCode?: string;
    expiresIn?: string | number;
    activationCodeExpire?: string | number;
}
export declare const otpResendTemp: (data: IOTPData) => string;
export {};
//# sourceMappingURL=otp-resend-temp.d.ts.map