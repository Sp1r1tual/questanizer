import { UserModel } from "../../user/models/user-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

const findUserById = async (id) => {
    const user = await UserModel.findById(id);

    if (!user) {
        throw ApiError.NotFound("User not found");
    }

    return user;
};

export { findUserById };
