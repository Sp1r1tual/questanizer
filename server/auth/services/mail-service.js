import nodemailer from "nodemailer";

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
                html: `
                    <div>
                        <h1>To activate your account, follow the link📯</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
            });

            console.log("Email sent successfully:", info.messageId);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}

export default new MailService();
