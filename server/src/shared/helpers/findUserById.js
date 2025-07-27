import { UserModel } from "../../user/models/user-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

const findUserById = async (id, errorMessage = "User not found") => {
    const user = await UserModel.findById(id);

    if (!user) {
        throw ApiError.BadRequest(errorMessage);
    }

    return user;
};

export { findUserById };
