import { jest } from "@jest/globals";
import activationMailTemplate from "../../../auth/views/mail-views/activation-mail.js";
import resetPasswordMailTemplate from "../../../auth/views/mail-views/reset-password-mail.js";

jest.unstable_mockModule("nodemailer", () => {
    return {
        default: {
            createTransport: jest.fn(),
        },
    };
});

const { default: nodemailer } = await import("nodemailer");
const { default: mailService } = await import(
    "../../../auth/services/mail-service.js"
);

describe("MailService", () => {
    let sendMailMock;

    beforeEach(() => {
        sendMailMock = jest.fn().mockResolvedValue({ messageId: "12345" });

        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        mailService.transporter = null;

        process.env.SMTP_USER = "test@example.com";
        process.env.SMTP_PASSWORD = "testpassword";
        process.env.API_URL = "http://localhost:5000";
        process.env.CLIENT_URL = "http://localhost:3000";
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("sendActivationMail sends an activation email", async () => {
        const to = "user@example.com";
        const link = "http://activation.link";

        await mailService.sendActivationMail(to, link);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_USER,
            to,
            subject: "Activating an account in " + process.env.API_URL,
            html: activationMailTemplate(link),
        });
    });

    it("sendPasswordResetMail sends a password reset email", async () => {
        const to = "user@example.com";
        const token = "resettoken123";
        const expectedLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await mailService.sendPasswordResetMail(to, token);

        expect(sendMailMock).toHaveBeenCalledWith({
            from: process.env.SMTP_USER,
            to,
            subject: "Password Reset Request - " + process.env.API_URL,
            html: resetPasswordMailTemplate(expectedLink),
        });
    });

    it("re-invocation does not create a new transporter", async () => {
        await mailService.sendActivationMail("a@a.com", "http://link1");

        const transporter1 = mailService.transporter;

        await mailService.sendActivationMail("b@b.com", "http://link2");

        const transporter2 = mailService.transporter;

        expect(transporter1).toBe(transporter2);
    });

    it("throws an error on failed send", async () => {
        sendMailMock.mockRejectedValueOnce(new Error("SMTP failure"));

        await expect(
            mailService.sendActivationMail("a@a.com", "http://fail.link")
        ).rejects.toThrow("SMTP failure");
    });

    it("throws an error on failed password reset send", async () => {
        const error = new Error("Reset SMTP failure");

        sendMailMock.mockRejectedValueOnce(error);

        await expect(
            mailService.sendPasswordResetMail("a@a.com", "resettoken123")
        ).rejects.toThrow("Reset SMTP failure");
    });
});
