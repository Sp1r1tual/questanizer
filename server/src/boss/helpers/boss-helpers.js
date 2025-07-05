import mongoose from "mongoose";
import BossModel from "../models/boss-model.js";
import ApiError from "../../shared/exceptions/api-error.js";

const validateObjectId = (id, name = "ID") => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.BadRequest(`Invalid ${name}`);
    }
};

const hasBossFound = async (userId) => {
    validateObjectId(userId, "user ID");
    const boss = await BossModel.findOne({ user: userId });

    if (!boss) throw ApiError.BadRequest("Boss not found");

    return boss;
};

const updateBossFromTemplate = (boss, template) => {
    boss.bossId = template.bossId;
    boss.bossName = template.bossName;
    boss.healthPoints = template.healthPoints;
    boss.maxHealthPoints = template.healthPoints;
    boss.bossPower = template.bossPower;
    boss.bossRewardExp = template.bossRewardExp;
    boss.bossRageBar = template.bossRageBar;
    boss.bossImg = template.bossImg;
};

export { validateObjectId, hasBossFound, updateBossFromTemplate };
