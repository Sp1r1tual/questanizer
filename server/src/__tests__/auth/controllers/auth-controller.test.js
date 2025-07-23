import { jest } from "@jest/globals";
import authController from "../../../auth/controllers/auth-controller.js";
import userService from "../../../auth/services/auth-service.js";
import RESPONSE_MESSAGES from "../../../shared/utils/messages/response-messages.js";

beforeAll(() => {
    userService.registration = jest.fn();
    userService.login = jest.fn();
    userService.forgotPassword = jest.fn();
    userService.resetPassword = jest.fn();
    userService.activate = jest.fn();
    userService.logout = jest.fn();
    userService.refresh = jest.fn();
});

describe("Auth Controller", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            cookies: {},
        };
        res = {
            cookie: jest.fn(),
            json: jest.fn(),
            clearCookie: jest.fn(),
            redirect: jest.fn(),
        };
        next = jest.fn();

        jest.clearAllMocks();
        process.env.CLIENT_URL = "http://client.url";
    });

    describe("registration", () => {
        it("should register user, set refresh token cookie and return user data", async () => {
            const userData = {
                refreshToken: "refresh-token",
                accessToken: "access-token",
                user: { email: "test@example.com" },
            };

            req.body = { email: "test@example.com", password: "pass" };
            userService.registration.mockResolvedValue(userData);

            await authController.registration(req, res, next);

            expect(userService.registration).toHaveBeenCalledWith(
                req.body.email,
                req.body.password
            );
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                userData.refreshToken,
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(userData);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error if service throws", async () => {
            const error = new Error("Registration failed");

            req.body = { email: "fail@example.com", password: "pass" };
            userService.registration.mockRejectedValue(error);

            await authController.registration(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });

    describe("login", () => {
        it("should login user, set refresh token cookie and return user data", async () => {
            const userData = {
                refreshToken: "refresh-token",
                accessToken: "access-token",
                user: { email: "test@example.com" },
            };

            req.body = { email: "test@example.com", password: "pass" };
            userService.login.mockResolvedValue(userData);

            await authController.login(req, res, next);

            expect(userService.login).toHaveBeenCalledWith(
                req.body.email,
                req.body.password
            );
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                userData.refreshToken,
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(userData);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error if service throws", async () => {
            const error = new Error("Login failed");

            req.body = { email: "fail@example.com", password: "pass" };
            userService.login.mockRejectedValue(error);

            await authController.login(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("logout", () => {
        it("should call service logout, clear cookie and respond with token", async () => {
            req.cookies = { refreshToken: "refresh-token" };
            userService.logout.mockResolvedValue("token-removed");

            await authController.logout(req, res, next);

            expect(userService.logout).toHaveBeenCalledWith("refresh-token");
            expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
            expect(res.json).toHaveBeenCalledWith("token-removed");
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error if service throws", async () => {
            const error = new Error("Logout failed");

            req.cookies = { refreshToken: "refresh-token" };
            userService.logout.mockRejectedValue(error);

            await authController.logout(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("refresh", () => {
        it("should refresh tokens, set cookie and respond with user data", async () => {
            const userData = {
                refreshToken: "new-refresh-token",
                accessToken: "new-access-token",
                user: { email: "test@example.com" },
            };

            req.cookies = { refreshToken: "refresh-token" };
            userService.refresh.mockResolvedValue(userData);

            await authController.refresh(req, res, next);

            expect(userService.refresh).toHaveBeenCalledWith("refresh-token");
            expect(res.cookie).toHaveBeenCalledWith(
                "refreshToken",
                userData.refreshToken,
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(userData);
            expect(next).not.toHaveBeenCalled();
        });

        it("should call next with error if service throws", async () => {
            const error = new Error("Refresh failed");

            req.cookies = { refreshToken: "refresh-token" };
            userService.refresh.mockRejectedValue(error);

            await authController.refresh(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("activate", () => {
        it("should activate user and redirect to login with success", async () => {
            req.params = { link: "activation-link" };
            userService.activate.mockResolvedValue();

            await authController.activate(req, res, next);

            expect(userService.activate).toHaveBeenCalledWith(
                "activation-link"
            );
            expect(res.redirect).toHaveBeenCalledWith(
                `${process.env.CLIENT_URL}/login?activated=1`
            );
        });

        it("should redirect to login with error query if activation fails", async () => {
            req.params = { link: "bad-link" };

            const error = new Error("Activation error");

            userService.activate.mockRejectedValue(error);

            await authController.activate(req, res, next);

            expect(res.redirect).toHaveBeenCalledWith(
                `${process.env.CLIENT_URL}/login?activated=0&error=Activation%20error`
            );
        });
    });

    describe("forgotPassword", () => {
        it("should call forgotPassword service and return message", async () => {
            req.body = { email: "test@example.com" };
            userService.forgotPassword.mockResolvedValue();

            await authController.forgotPassword(req, res, next);

            expect(userService.forgotPassword).toHaveBeenCalledWith(
                "test@example.com"
            );
            expect(res.json).toHaveBeenCalledWith({
                message: RESPONSE_MESSAGES.forgotPassword,
            });
        });

        it("should call next with error if service throws", async () => {
            const error = new Error("Forgot password failed");

            userService.forgotPassword.mockRejectedValue(error);

            await authController.forgotPassword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe("resetPassword", () => {
        it("should reset password and return success message", async () => {
            req.body = { password: "newpass" };
            req.params = { token: "reset-token" };
            userService.resetPassword.mockResolvedValue();

            await authController.resetPassword(req, res, next);

            expect(userService.resetPassword).toHaveBeenCalledWith(
                "reset-token",
                "newpass"
            );
            expect(res.json).toHaveBeenCalledWith({
                message: RESPONSE_MESSAGES.passwordResetSuccess,
            });
        });

        it("should call next with error if service throws", async () => {
            const error = new Error("Reset password failed");

            userService.resetPassword.mockRejectedValue(error);

            await authController.resetPassword(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});
