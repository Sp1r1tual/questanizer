import { validationResult } from "express-validator";
import userService from "../services/user-service.js";
import ApiError from "../exceptions/api-error.js";
import activationSuccessHTML from "../views/activation/success.js";
import activationErrorHTML from "../views/activation/error.js";

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        "Error during validation",
                        errors.array()
                    )
                );
            }

            const { email, password } = req.body;
            const userData = await userService.registration(email, password);

            res.cookie("refreshToken", userData.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/api",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);

            res.cookie("refreshToken", userData.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/api",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            if (!email) {
                return next(ApiError.BadRequest("Email is required"));
            }

            await userService.forgotPassword(email);

            return res.json({
                message:
                    "If this email exists in our system, you will receive a password reset link shortly",
            });
        } catch (error) {
            return res.json({
                message:
                    "If this email exists in our system, you will receive a password reset link shortly",
            });
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token } = req.params;
            const { password } = req.body;

            if (!token) {
                return next(ApiError.BadRequest("Reset token are required"));
            }

            if (!password) {
                return next(ApiError.BadRequest("New password are required"));
            }

            await userService.resetPassword(token, password);

            return res.json({
                message: "Password has been reset successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.send(
                activationSuccessHTML(`${process.env.CLIENT_URL}/login`)
            );
        } catch (error) {
            return res
                .status(400)
                .send(
                    activationErrorHTML(
                        `${process.env.CLIENT_URL}/login`,
                        error.message
                    )
                );
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);

            res.clearCookie("refreshToken");
            res.json(token);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            res.cookie("refreshToken", userData.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/api",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
