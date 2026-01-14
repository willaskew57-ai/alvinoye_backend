interface IResetPassData {
    name: string;
    verificationCode: string;
    verificationCodeExpire: string | number;
}
/**
 * Generates the HTML for the Password Reset Email.
 */
export declare const resetPassEmailTemp: (data: IResetPassData) => string;
export {};
//# sourceMappingURL=reset-pass-email-temp.d.ts.map