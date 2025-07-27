import nodemailer from "nodemailer";
import { activationMailTemplate } from "../views/mail-views/activation-mail.js";
import { resetPasswordMailTemplate } from "../views/mail-views/reset-password-mail.js";

class MailService {
    constructor() {
        this.transporter = null;
    }

    initializeTransporter() {
        if (!this.transporter) {
            this.transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
        }
    }

    async sendActivationMail(to, link) {
        this.initializeTransporter();

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: "Activating an account in " + process.env.API_URL,
                html: activationMailTemplate(link),
            });

            console.log("Email sent successfully:", info.messageId);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }

    async sendPasswordResetMail(to, resetToken) {
        this.initializeTransporter();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: "Password Reset Request - " + process.env.API_URL,
                html: resetPasswordMailTemplate(resetLink),
            });

            console.log(
                "Password reset email sent successfully:",
                info.messageId
            );
        } catch (error) {
            console.error("Error sending password reset email:", error);
            throw error;
        }
    }
}

const mailService = new MailService();

export { mailService };
