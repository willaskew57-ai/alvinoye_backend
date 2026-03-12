import type { SentMessageInfo } from 'nodemailer';
interface IEmailOptions {
    email: string;
    subject: string;
    html: string;
}
/**
 * Sends an email using SMTP configuration.
 * @param options - Object containing recipient email, subject, and HTML content.
 */
export declare const sendEmail: (options: IEmailOptions) => Promise<SentMessageInfo>;
export {};
//# sourceMappingURL=send-email.d.ts.map