interface IOTPData {
    user: string;
    code?: string;
    activationCode?: string;
    expiresIn?: string | number;
    activationCodeExpire?: string | number;
}
interface ISignUpData {
    user: string;
    activationCode: string;
    activationCodeExpire: string | number;
}
interface IResetPassData {
    name: string;
    verificationCode: string;
    verificationCodeExpire: string | number;
}
export declare const EmailHelpers: {
    sendOtpResendEmail: (email: string, data: IOTPData) => Promise<void>;
    sendRegisterEmail: (email: string, data: ISignUpData) => Promise<void>;
    sendResetPasswordEmail: (email: string, data: IResetPassData) => Promise<void>;
};
export {};
//# sourceMappingURL=email-helper.d.ts.map