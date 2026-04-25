import Queue from 'better-queue';

const emailQueue = new Queue(
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

const pushEmailJob = async (
  emailJob: () => Promise<void>,
  emailAddress?: string
): Promise<void> => {
  emailQueue.push(async () => {
    let attempt = 0;

    const attemptSend = async (): Promise<void> => {
      attempt++;
      try {
        await emailJob();
      } catch (error) {
        console.error(
          `[email.queue] Attempt ${attempt}/${MAX_RETRIES} failed${emailAddress ? ` for ${emailAddress}` : ''}:`,
          error
        );
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return attemptSend();
        }
        console.error(
          `[email.queue] All ${MAX_RETRIES} attempts failed${emailAddress ? ` for ${emailAddress}` : ''}`
        );
        throw error;
      }
    };

    await attemptSend();
  });
};

export { emailQueue, pushEmailJob };