import mongoose from "mongoose";

import { UserModel } from "../models/user-model.js";
import { UserStatsModel } from "../../stats/models/user-stats-model.js";

import { deleteOldAvatarIfNeeded } from "../helpers/delete-old-user-avatar.js";
import { validateUsername } from "../helpers/validate-username.js";

import { findUserById } from "../../shared/utils/findUserById.js";
import { paginate } from "../../shared/utils/query/paginate.js";
import { searchInFields } from "../../shared/utils/query/search-in-fields.js";
import { UserDto } from "../../shared/dtos/user-dto.js";

class UserService {
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

    await validateUsername(updateData.username, user.username);
    await deleteOldAvatarIfNeeded(user.photoUrl, updateData.photoUrl);

    user.username = updateData.username ?? user.username;
    user.bio = updateData.bio ?? user.bio;

    if (updateData.photoUrl) {
      user.photoUrl = updateData.photoUrl;
    }

    await user.save();

    return new UserDto(user);
  }

  async getAllUsers() {
    const users = await UserModel.find();

    return users;
  }

  async searchUsers(query, requesterId, page, limit) {
    const trimmedQuery = query?.trim() || "";

    const filter = { isActivated: true };

    if (requesterId) {
      filter._id = { $ne: new mongoose.Types.ObjectId(requesterId) };
    }

    if (mongoose.Types.ObjectId.isValid(trimmedQuery)) {
      filter._id = {
        ...filter._id,
        $eq: new mongoose.Types.ObjectId(trimmedQuery),
      };
    } else if (trimmedQuery) {
      Object.assign(filter, searchInFields(["username"], trimmedQuery));
    }

    const paginated = await paginate(UserModel, filter, {
      page,
      limit,
      sortByLengthField: "username",
    });

    return {
      users: paginated.results.map((user) => new UserDto(user)),
      ...paginated,
    };
  }
}

const userService = new UserService();

export { userService };
