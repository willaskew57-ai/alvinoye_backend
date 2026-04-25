import Queue from 'better-queue';
declare const smsQueue: Queue<any, any>;
declare const pushSmsJob: (smsJob: () => Promise<{
    success: boolean;
    error?: string;
}>, phoneNumber?: string) => Promise<void>;
export { smsQueue, pushSmsJob };
//# sourceMappingURL=sms.queue.d.ts.map