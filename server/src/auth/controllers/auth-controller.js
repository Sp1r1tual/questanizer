import { authService } from "../services/auth-service.js";
import { REFRESH_COOKIE_OPTIONS } from "../utils/refresh-cookie-options.js";
import { RESPONSE_MESSAGES } from "../../shared/utils/messages/response-messages.js";

const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, REFRESH_COOKIE_OPTIONS);
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
        const activationLink = req.params.link;

        await authService.activate(activationLink);
        return res.redirect(`${process.env.CLIENT_URL}/login?activated=1`);
    } catch (error) {
        console.error("Activation error:", error);
        return res.redirect(
            `${
                process.env.CLIENT_URL
            }/login?activated=0&error=${encodeURIComponent(error.message)}`
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
