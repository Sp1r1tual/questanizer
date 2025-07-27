import { UserModel } from "../models/user-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

const validateUsername = async (newUsername, currentUsername) => {
    try {
        if (newUsername && newUsername !== currentUsername) {
            const existing = await UserModel.findOne({ username: newUsername });

            if (existing) {
                throw ApiError.Conflict("This username is already taken");
            }
        }
    } catch (error) {
        console.error("Error in validateUsername:", error);
        throw error;
    }
};

export { validateUsername };
