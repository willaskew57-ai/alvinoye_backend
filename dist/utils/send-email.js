"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = __importDefault(require("../config/env.config"));
/**
 * Sends an email using SMTP configuration.
 * @param options - Object containing recipient email, subject, and HTML content.
 */
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        host: env_config_1.default.smtp_host || 'smtp.gmail.com',
        port: env_config_1.default.smtp_port ? parseInt(env_config_1.default.smtp_port) : 587,
        secure: env_config_1.default.smtp_port === '465',
        auth: {
            user: env_config_1.default.smtp_mail,
            pass: env_config_1.default.smtp_password,
        },
    });
    const { email, subject, html } = options;
    const mailOptions = {
        from: `"${env_config_1.default.smtp_service_name || 'Support'}" <${env_config_1.default.smtp_mail}>`,
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
    }
    catch (error) {
        console.error('Error occurred while sending email:', error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=send-email.js.map