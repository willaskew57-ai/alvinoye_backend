interface IResetPassData {
    name: string;
    verificationCode: string;
    verificationCodeExpire: string | number;
}
export declare const resetPassEmailTemp: (data: IResetPassData) => string;
export {};
//# sourceMappingURL=reset-pass-email-temp.d.ts.map