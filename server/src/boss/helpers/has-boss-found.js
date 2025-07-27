import { BossModel } from "../../boss/models/boss-model.js";
import { ApiError } from "../../shared/exceptions/api-error.js";
import { validateObjectId } from "../../shared/utils/validations/validate-object-id.js";

const hasBossFound = async (userId) => {
    validateObjectId(userId, "user ID");

    const boss = await BossModel.findOne({ user: userId });

    if (!boss) throw ApiError.BadRequest("Boss not found");

    return boss;
};

export { hasBossFound };
