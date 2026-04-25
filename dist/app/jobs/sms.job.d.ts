export interface SendSmsPayload {
    to: string;
    body: string;
}
export declare const sendSmsJob: (payload: SendSmsPayload) => Promise<{
    success: boolean;
    error?: string;
}>;
//# sourceMappingURL=sms.job.d.ts.map