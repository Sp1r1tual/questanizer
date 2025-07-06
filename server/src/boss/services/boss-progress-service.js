import BossProgressModel from "../models/boss-progress-model.js";
import { validateObjectId } from "../helpers/boss-helpers.js";

const getBossProgress = async (userId) => {
    validateObjectId(userId, "user ID");

    let progress = await BossProgressModel.findOne({ user: userId });

    if (!progress) {
        progress = await BossProgressModel.create({
            user: userId,
            lastDefeatedBossId: 0,
            currentAvailableBossId: 1,
            totalBossesDefeated: 0,
            totalExpFromBosses: 0,
        });
    }

    return progress;
};

const updateBossProgress = async (userId, defeatedBossId, expGained) => {
    validateObjectId(userId, "user ID");

    const progress = await getBossProgress(userId);

    progress.lastDefeatedBossId = defeatedBossId;
    progress.currentAvailableBossId = defeatedBossId + 1;
    progress.totalBossesDefeated += 1;
    progress.totalExpFromBosses += expGained;
    await progress.save();

    return progress;
};

const resetBossProgress = async (userId) => {
    validateObjectId(userId, "user ID");

    const progress = await BossProgressModel.findOne({ user: userId });

    if (progress) {
        await progress.deleteOne();
    }

    return true;
};

const getAvailableBossId = async (userId) => {
    const progress = await getBossProgress(userId);

    return progress.currentAvailableBossId;
};

export default {
    getBossProgress,
    updateBossProgress,
    resetBossProgress,
    getAvailableBossId,
};
