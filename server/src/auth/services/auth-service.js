import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../../user/models/user-model.js";
import mailService from "./mail-service.js";
import tokenService from "./token-service.js";
import UserDto from "../../shared/dtos/user-dto.js";
import ApiError from "../../shared/exceptions/api-error.js";
import { findUserById } from "../../shared/helpers/findUserById.js";

class AuthService {
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
            `${process.env.API_URL}/api/auth/activate/${activationLink}`
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

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
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

    async logout(refreshToken) {
        return tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError();

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

    async forgotPassword(email) {
        const user = await UserModel.findOne({ email });

        if (!user) return;

        const resetToken = tokenService.generateResetToken({
            email: user.email,
            id: user._id,
        });

        await tokenService.saveResetToken(user._id, resetToken);
        await mailService.sendPasswordResetMail(user.email, resetToken);
    }

    async resetPassword(resetToken, newPassword) {
        const userData = tokenService.validateResetToken(resetToken);

        if (!userData)
            throw ApiError.BadRequest("Invalid or expired reset token");

        const tokenData = await tokenService.findResetToken(resetToken);

        if (!tokenData)
            throw ApiError.BadRequest("Invalid or expired reset token");

        const user = await findUserById(userData.id);
        const hashed = await bcrypt.hash(newPassword, 5);

        user.password = hashed;
        await user.save();

        await tokenService.removeResetToken(resetToken);
    }
}

export default new AuthService();
