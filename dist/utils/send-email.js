import nodemailer from 'nodemailer';
import configs from '../config/env.config';
/**
 * Sends an email using SMTP configuration.
 * @param options - Object containing recipient email, subject, and HTML content.
 */
export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: configs.smtp_host || 'smtp.gmail.com',
        port: configs.smtp_port ? parseInt(configs.smtp_port) : 587,
        // secure: true for port 465, false for other ports (like 587)
        secure: configs.smtp_port === '465',
        auth: {
            user: configs.smtp_mail,
            pass: configs.smtp_password,
        },
    });
    const { email, subject, html } = options;
    const mailOptions = {
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
        // 4. Send the mail and return the info object
        const info = await transporter.sendMail(mailOptions);
        // console.log('Email sent successfully:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error occurred while sending email:', error);
        throw error;
    }
};
//# sourceMappingURL=send-email.js.map