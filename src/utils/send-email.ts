import nodemailer from 'nodemailer';
import type { SentMessageInfo } from 'nodemailer';
import configs from '../config/env.config';

interface IEmailOptions {
  email: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using SMTP configuration.
 * @param options - Object containing recipient email, subject, and HTML content.
 */
export const sendEmail = async (
  options: IEmailOptions
): Promise<SentMessageInfo> => {
  // Diagnostic: makes it obvious in the logs (e.g. Railway) whether the SMTP
  // credentials are actually loaded. Never prints the password itself.
  if (!configs.smtp_mail || !configs.smtp_password) {
    console.error(
      `[send-email] SMTP config missing -> smtp_mail: ${
        configs.smtp_mail ? 'set' : 'MISSING'
      }, smtp_password: ${
        configs.smtp_password ? 'set' : 'MISSING'
      }. Emails will fail until these env vars are set.`
    );
  }

  const transporter = nodemailer.createTransport({
    host: configs.smtp_host || 'smtp.gmail.com',
    port: configs.smtp_port ? parseInt(configs.smtp_port as string) : 587,
    secure: configs.smtp_port === '465',
    pool: true, // <--- Add this
    maxConnections: 5, // Max simultaneous connections
    maxMessages: 100, // Max messages per connection
    auth: {
      user: configs.smtp_mail,
      pass: configs.smtp_password,
    },
  });

  const { email, subject, html } = options;

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${configs.smtp_service_name || 'Support'}" <${configs.smtp_mail}>`,
    to: email,
    subject: subject,
    html: html,
    date: new Date(),
    headers: {
      'X-Signed-By': 'bdCalling.com',
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error occurred while sending email:', error);
    throw error;
  }
};
