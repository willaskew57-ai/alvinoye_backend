interface ISignUpData {
    user: string;
    activationCode: string;
    activationCodeExpire: string | number;
}
/**
 * Generates the HTML for the Registration Welcome Email.
 */
export declare const registerEmailTemp: (data: ISignUpData) => string;
export {};
//# sourceMappingURL=register-email-temp.d.ts.map