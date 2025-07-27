import { BossProgressModel } from "../models/boss-progress-model.js";
import { validateUserId } from "../../shared/utils/validations/validate-object-id.js";

class BossProgressService {
    async createDefaultProgress(userId) {
        return BossProgressModel.create({
            user: userId,
            lastDefeatedBossId: 0,
            currentAvailableBossId: 1,
            totalBossesDefeated: 0,
            totalExpFromBosses: 0,
        });
    }

    async getBossProgress(userId) {
        validateUserId(userId);

        let progress = await BossProgressModel.findOne({ user: userId });

        if (!progress) {
            progress = await this.createDefaultProgress(userId);
        }

        return progress;
    }

    async updateBossProgress(userId, defeatedBossId, expGained) {
        validateUserId(userId);

        const progress = await this.getBossProgress(userId);

        Object.assign(progress, {
            lastDefeatedBossId: defeatedBossId,
            currentAvailableBossId: defeatedBossId + 1,
            totalBossesDefeated: progress.totalBossesDefeated + 1,
            totalExpFromBosses: progress.totalExpFromBosses + expGained,
        });

        await progress.save();

        return progress;
    }

    async resetBossProgress(userId) {
        validateUserId(userId);

        const progress = await BossProgressModel.findOne({ user: userId });

        if (progress) await progress.deleteOne();

        return true;
    }

    async getAvailableBossId(userId) {
        validateUserId(userId);

        const progress = await this.getBossProgress(userId);

        return progress.currentAvailableBossId;
    }
}

const bossProgressService = new BossProgressService();

export { bossProgressService };
