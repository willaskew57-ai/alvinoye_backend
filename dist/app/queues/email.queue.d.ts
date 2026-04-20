import Queue from 'queue';
declare const emailQueue: Queue;
declare const pushEmailJob: (emailJob: () => Promise<void>, emailAddress?: string) => Promise<void>;
export { emailQueue, pushEmailJob };
//# sourceMappingURL=email.queue.d.ts.map