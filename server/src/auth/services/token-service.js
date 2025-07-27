import jwt from "jsonwebtoken";
import { TokenModel } from "../models/token-model.js";
import { ResetTokenModel } from "../models/reset-token-model.js";

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
        try {
            const tokenData = await TokenModel.findOne({ user: userId });

            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return await tokenData.save();
            }

            const token = await TokenModel.create({
                user: userId,
                refreshToken,
            });

            return token;
        } catch (error) {
            console.error("Error in saveToken:", error);
            throw error;
        }
    }

    async saveResetToken(userId, resetToken) {
        try {
            const token = await ResetTokenModel.create({
                user: userId,
                resetToken,
            });

            return token;
        } catch (error) {
            console.error("Error in saveResetToken:", error);
            throw error;
        }
    }

    async removeToken(refreshToken) {
        try {
            const tokenData = await TokenModel.deleteOne({ refreshToken });

            return tokenData;
        } catch (error) {
            console.error("Error in removeToken:", error);
            throw error;
        }
    }

    async removeResetToken(resetToken) {
        try {
            const tokenData = await ResetTokenModel.deleteOne({ resetToken });

            return tokenData;
        } catch (error) {
            console.error("Error in removeResetToken:", error);
            throw error;
        }
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
        try {
            const tokenData = await TokenModel.findOne({ refreshToken });

            return tokenData;
        } catch (error) {
            console.error("Error in findToken:", error);
            throw error;
        }
    }

    async findResetToken(resetToken) {
        try {
            const tokenData = await ResetTokenModel.findOne({ resetToken });

            return tokenData;
        } catch (error) {
            console.error("Error in findResetToken:", error);
            throw error;
        }
    }
}

const tokenService = new TokenService();

export { tokenService };
