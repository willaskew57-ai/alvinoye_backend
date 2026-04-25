import Queue from 'better-queue';

const smsQueue = new Queue(
  async (task: () => Promise<void>, cb: (err?: any) => void) => {
    try {
      await task();
      cb();
    } catch (err) {
      cb(err);
    }
  },
  {
    concurrent: 2,
    // autostart: true,
  }
);

const MAX_RETRIES = 3;

const pushSmsJob = async (
  smsJob: () => Promise<{ success: boolean; error?: string }>,
  phoneNumber?: string
): Promise<void> => {
  smsQueue.push(async () => {
    let attempt = 0;

    const attemptSend = async (): Promise<void> => {
      attempt++;
      try {
        const result = await smsJob();
        if (!result.success) {
          throw new Error(result.error || 'SMS send failed');
        }
      } catch (error) {
        console.error(
          `[sms.queue] Attempt ${attempt}/${MAX_RETRIES} failed${phoneNumber ? ` for ${phoneNumber}` : ''}:`,
          error
        );
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return attemptSend();
        }
        console.error(
          `[sms.queue] All ${MAX_RETRIES} attempts failed${phoneNumber ? ` for ${phoneNumber}` : ''}`
        );
        throw error;
      }
    };

    await attemptSend();
  });
};

export { smsQueue, pushSmsJob };
