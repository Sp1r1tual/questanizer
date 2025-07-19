import BossProgressModel from "../models/boss-progress-model.js";
import { validateUserId } from "../../shared/utils/validations/validate-object-id.js";

const createDefaultProgress = async (userId) => {
    return BossProgressModel.create({
        user: userId,
        lastDefeatedBossId: 0,
        currentAvailableBossId: 1,
        totalBossesDefeated: 0,
        totalExpFromBosses: 0,
    });
};

const getBossProgress = async (userId) => {
    validateUserId(userId);

    let progress = await BossProgressModel.findOne({ user: userId });

    if (!progress) {
        progress = await createDefaultProgress(userId);
    }

    return progress;
};

const updateBossProgress = async (userId, defeatedBossId, expGained) => {
    validateUserId(userId);

    const progress = await getBossProgress(userId);

    Object.assign(progress, {
        lastDefeatedBossId: defeatedBossId,
        currentAvailableBossId: defeatedBossId + 1,
        totalBossesDefeated: progress.totalBossesDefeated + 1,
        totalExpFromBosses: progress.totalExpFromBosses + expGained,
    });

    await progress.save();
    return progress;
};

const resetBossProgress = async (userId) => {
    validateUserId(userId);

    const progress = await BossProgressModel.findOne({ user: userId });

    if (progress) await progress.deleteOne();

    return true;
};

const getAvailableBossId = async (userId) => {
    validateUserId(userId);

    const progress = await getBossProgress(userId);
    return progress.currentAvailableBossId;
};

export default {
    getBossProgress,
    updateBossProgress,
    resetBossProgress,
    getAvailableBossId,
};
