import jwt from "jsonwebtoken";
import tokenModel from "../models/token-model.js";
import resetTokenModel from "../models/reset-token-model.js";

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: "30d",
        });
        return {
            accessToken,
            refreshToken,
        };
    }

    generateResetToken(payload) {
        const resetToken = jwt.sign(payload, process.env.JWT_RESET_SECRET, {
            expiresIn: "15m",
        });
        return resetToken;
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await tokenModel.create({ user: userId, refreshToken });
        return token;
    }

    async saveResetToken(userId, resetToken) {
        const token = await resetTokenModel.create({
            user: userId,
            resetToken,
        });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    async removeResetToken(resetToken) {
        const tokenData = await resetTokenModel.deleteOne({ resetToken });
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateResetToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_RESET_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData;
    }

    async findResetToken(resetToken) {
        const tokenData = await resetTokenModel.findOne({ resetToken });
        return tokenData;
    }
}

export default new TokenService();
