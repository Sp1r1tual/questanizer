import userService from "../services/user-service.js";
import REFRESH_COOKIE_OPTIONS from "../utils/refresh-cookie-options.js";
import RESPONSE_MESSAGES from "../../shared/utils/messages/response-messages.js";

const setRefreshTokenCookie = (res, token) => {
    res.cookie("refreshToken", token, REFRESH_COOKIE_OPTIONS);
};

const registration = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.registration(email, password);

        setRefreshTokenCookie(res, userData.refreshToken);
        return res.json(userData);
    } catch (error) {
        return next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userData = await userService.login(email, password);

        setRefreshTokenCookie(res, userData.refreshToken);
        return res.json(userData);
    } catch (error) {
        return next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        await userService.forgotPassword(email);

        return res.json({
            message: RESPONSE_MESSAGES.forgotPassword,
        });
    } catch (error) {
        console.error("forgotPassword error:", error);
        return next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const { token } = req.params;

        await userService.resetPassword(token, password);
        return res.json({ message: RESPONSE_MESSAGES.passwordResetSuccess });
    } catch (error) {
        return next(error);
    }
};

const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;

        await userService.activate(activationLink);
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

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);

        res.clearCookie("refreshToken");
        return res.json(token);
    } catch (error) {
        return next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const userData = await userService.refresh(refreshToken);

        setRefreshTokenCookie(res, userData.refreshToken);
        return res.json(userData);
    } catch (error) {
        return next(error);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await userService.getUserById(userId);

        return res.json({
            id: user._id,
            email: user.email,
            username: user.username ?? null,
            bio: user.bio ?? "",
            isActivated: user.isActivated,
        });
    } catch (error) {
        return next(error);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { username, bio } = req.body;

        const update = {};
        if (username !== undefined) update.username = username;
        if (bio !== undefined) update.bio = bio;

        const updatedUser = await userService.updateUserProfile(userId, update);

        return res.json(updatedUser);
    } catch (error) {
        return next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (error) {
        return next(error);
    }
};

export default {
    registration,
    login,
    forgotPassword,
    resetPassword,
    activate,
    logout,
    refresh,
    getUserProfile,
    updateUserProfile,
    getUsers,
};
