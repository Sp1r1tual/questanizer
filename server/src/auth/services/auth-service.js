import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { UserModel } from "../../user/models/user-model.js";
import { UserInventoryModel } from "../../user/models/user-inventory-model.js";

import { mailService } from "./mail-service.js";
import { tokenService } from "./token-service.js";

import { ApiError } from "../../shared/exceptions/api-error.js";
import { findUserById } from "../../shared/utils/findUserById.js";
import { UserDto } from "../../shared/dtos/user-dto.js";

class AuthService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw ApiError.Conflict("errors.auth.registration.alreadyRegistered");
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
      `${process.env.API_URL}/activate/${activationLink}`,
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
      throw ApiError.NotFound("errors.auth.activation.invalidLink");
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.NotFound("errors.auth.login.userNotFound");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw ApiError.UnauthorizedError("errors.auth.login.incorrectPassword");
    }

    if (!user.isActivated) {
      throw ApiError.Forbidden("errors.auth.login.activateMsg");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    const existingInventory = await UserInventoryModel.findOne({
      user: user._id,
    });

    if (!existingInventory) {
      await UserInventoryModel.create({ user: user._id });
    }

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const result = await tokenService.removeToken(refreshToken);

    if (!result) {
      throw ApiError.BadRequest("errors.auth.logout.failed");
    }
    return result;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError("errors.auth.refresh.tokenNotFound");
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError("errors.auth.refresh.invalidToken");
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

    if (!user) {
      throw ApiError.NotFound("errors.auth.password.forgot.emailNotFound");
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
      throw ApiError.UnauthorizedError("errors.auth.password.reset.invalidToken");
    }

    const tokenData = await tokenService.findResetToken(resetToken);

    if (!tokenData) {
      throw ApiError.UnauthorizedError("errors.auth.password.reset.invalidToken");
    }

    const user = await findUserById(userData.id);
    const hashed = await bcrypt.hash(newPassword, 5);

    user.password = hashed;

    await user.save();
    await tokenService.removeResetToken(resetToken);
  }
}

const authService = new AuthService();

export { authService };
