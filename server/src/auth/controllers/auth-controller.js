import { authService } from "../services/auth-service.js";

import { RESPONSE_MESSAGES } from "../../shared/utils/messages/response-messages.js";

import { activationSuccessHTML } from "../views/activation/success.js";
import { activationErrorHTML } from "../views/activation/error.js";

const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/api",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

const registration = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await authService.registration(email, password);

        setRefreshTokenCookie(res, userData.refreshToken);

        return res.json(userData);
    } catch (error) {
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await authService.login(email, password);

        setRefreshTokenCookie(res, userData.refreshToken);

        return res.json(userData);
    } catch (error) {
        return next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await authService.logout(refreshToken);

        res.clearCookie("refreshToken");

        return res.json(token);
    } catch (error) {
        return next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await authService.refresh(refreshToken);

        setRefreshTokenCookie(res, userData.refreshToken);

        return res.json(userData);
    } catch (error) {
        return next(error);
    }
};

const activate = async (req, res, next) => {
    try {
        await authService.activate(req.params.link);

        res.type("html").send(
            activationSuccessHTML(`${process.env.CLIENT_URL}/login`)
        );
    } catch (error) {
        res.status(400)
            .type("html")
            .send(
                activationErrorHTML(
                    `${process.env.CLIENT_URL}/login`,
                    error.message
                )
            );
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        await authService.forgotPassword(email);

        return res.json({ message: RESPONSE_MESSAGES.forgotPassword });
    } catch (error) {
        console.error("forgotPassword error:", error);
        return next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        await authService.resetPassword(token, password);

        return res.json({ message: RESPONSE_MESSAGES.passwordResetSuccess });
    } catch (error) {
        return next(error);
    }
};

export {
    registration,
    login,
    logout,
    refresh,
    activate,
    forgotPassword,
    resetPassword,
};
