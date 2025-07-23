import UserModel from "../models/user-model.js";
import ApiError from "../../shared/exceptions/api-error.js";

const validateUsername = async (newUsername, currentUsername) => {
    if (newUsername && newUsername !== currentUsername) {
        const existing = await UserModel.findOne({ username: newUsername });

        if (existing) {
            throw ApiError.BadRequest("This username is already taken");
        }
    }
};

export default validateUsername;
