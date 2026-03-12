interface SendSmsResponse {
    success: boolean;
    sid?: string;
    message?: string;
    error?: string;
}
export declare const sendSms: (to: string, body: string) => Promise<SendSmsResponse>;
export {};
//# sourceMappingURL=send-sms.d.ts.map