import nodemailer from "nodemailer";
import { activationMailTemplate } from "../views/mail-views/activation-mail.js";
import { resetPasswordMailTemplate } from "../views/mail-views/reset-password-mail.js";

class MailService {
    constructor() {
        this.transporter = null;
    }

    initializeTransporter() {
        try {
            if (!this.transporter) {
                this.transporter = nodemailer.createTransporter({
                    service: "gmail",
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD,
                    },
                });
            }
        } catch (error) {
            console.error("Error in initializeTransporter:", error);
            throw error;
        }
    }

    async sendActivationMail(to, link) {
        try {
            this.initializeTransporter();

            const info = await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: "Activating an account in " + process.env.API_URL,
                html: activationMailTemplate(link),
            });

            console.log("Email sent successfully:", info.messageId);
        } catch (error) {
            console.error("Error in sendActivationMail:", error);
            throw error;
        }
    }

    async sendPasswordResetMail(to, resetToken) {
        try {
            this.initializeTransporter();

            const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

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
            console.error("Error in sendPasswordResetMail:", error);
            throw error;
        }
    }
}

const mailService = new MailService();

export { mailService };
