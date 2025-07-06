import ApiError from "../../shared/exceptions/api-error.js";
import BossModel from "../models/boss-model.js";

const bossMiddleware = async (req, res, next) => {
    try {
        if (!req.user?.id) {
            return next(ApiError.Unauthorized("User not authenticated"));
        }

        const boss = await BossModel.findOne({ user: req.user.id });

        req.boss = boss;
        next();
    } catch (error) {
        next(error);
    }
};

export default bossMiddleware;
