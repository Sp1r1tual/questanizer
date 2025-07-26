import UserModel from "../models/user-model.js";
import UserStatsModel from "../../stats/models/user-stats-model.js";
import UserDto from "../../shared/dtos/user-dto.js";
import { findUserById } from "../../shared/helpers/findUserById.js";
import { paginate } from "../../shared/helpers/paginate.js";
import validateUsername from "../helpers/validate-username.js";
import deleteOldAvatarIfNeeded from "../helpers/delete-old-user-avatar.js";
import { filterSearchQuery } from "../../shared/utils/search-filters/filter-search-query.js";

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
        const filter = {
            ...filterSearchQuery(["username"], query),
            ...(requesterId && { _id: { $ne: requesterId } }),
        };

        const paginated = await paginate(UserModel, filter, { page, limit });

        return {
            users: paginated.results.map((user) => new UserDto(user)),
            ...paginated,
        };
    }
}

export default new UserService();
