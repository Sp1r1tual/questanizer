import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/user-model.js";
import UserStatsModel from "../../stats/models/user-stats-model.js";
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../dto/user-dto.js";
import ApiError from "../../shared/exceptions/api-error.js";
import { findUserById } from "../helpers/findUserById.js";

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });

        if (candidate) {
            throw ApiError.BadRequest(
                `A user with this mailbox: ${email} is already registered.`
            );
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4();

        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
        });

        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/activate/${activationLink}`
        );

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });

        if (!user) {
            throw ApiError.BadRequest("Invalid activation link");
        }

        user.isActivated = true;

        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw ApiError.BadRequest(
                "User with this email address was not found"
            );
        }

        const isPasswordsEquals = await bcrypt.compare(password, user.password);

        if (!isPasswordsEquals) {
            throw ApiError.BadRequest("Incorrect password");
        }

        if (!user.isActivated) {
            throw ApiError.BadRequest("Please activate your account via email");
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async forgotPassword(email) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return;
        }

        const resetToken = tokenService.generateResetToken({
            email: user.email,
            id: user._id,
        });

        await tokenService.saveResetToken(user._id, resetToken);
        await mailService.sendPasswordResetMail(user.email, resetToken);
    }

    async resetPassword(resetToken, newPassword) {
        const userData = tokenService.validateResetToken(resetToken);

        if (!userData) {
            throw ApiError.BadRequest("Invalid or expired reset token");
        }

        const tokenData = await tokenService.findResetToken(resetToken);

        if (!tokenData) {
            throw ApiError.BadRequest("Invalid or expired reset token");
        }

        const user = await findUserById(userData.id);

        const hashPassword = await bcrypt.hash(newPassword, 5);

        user.password = hashPassword;
        await user.save();
        await tokenService.removeResetToken(resetToken);
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async getUserById(userId, includeStats = false) {
        const user = await findUserById(userId);
        let stats = null;

        if (includeStats) {
            stats = await UserStatsModel.findOne({ user: user._id }).lean();
        }

        return new UserDto(user, stats);
    }

    async updateUserProfile(userId, updateData) {
        const user = await findUserById(userId);

        if (updateData.username && updateData.username !== user.username) {
            const existing = await UserModel.findOne({
                username: updateData.username,
            });

            if (existing) {
                throw ApiError.BadRequest("This username is already taken");
            }
        }

        user.username = updateData.username ?? user.username;
        user.bio = updateData.bio ?? user.bio;

        await user.save();

        return new UserDto(user);
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

export default new UserService();
