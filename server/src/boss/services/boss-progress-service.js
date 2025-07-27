import { BossProgressModel } from "../models/boss-progress-model.js";
import { validateUserId } from "../../shared/utils/validations/validate-object-id.js";

class BossProgressService {
    async createDefaultProgress(userId) {
        try {
            return BossProgressModel.create({
                user: userId,
                lastDefeatedBossId: 0,
                currentAvailableBossId: 1,
                totalBossesDefeated: 0,
                totalExpFromBosses: 0,
            });
        } catch (error) {
            console.error("Error in createDefaultProgress:", error);
            throw error;
        }
    }

    async getBossProgress(userId) {
        try {
            validateUserId(userId);

            let progress = await BossProgressModel.findOne({ user: userId });

            if (!progress) {
                progress = await this.createDefaultProgress(userId);
            }

            return progress;
        } catch (error) {
            console.error("Error in getBossProgress:", error);
            throw error;
        }
    }

    async updateBossProgress(userId, defeatedBossId, expGained) {
        try {
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
        } catch (error) {
            console.error("Error in updateBossProgress:", error);
            throw error;
        }
    }

    async resetBossProgress(userId) {
        try {
            validateUserId(userId);

            const progress = await BossProgressModel.findOne({ user: userId });

            if (progress) await progress.deleteOne();

            return true;
        } catch (error) {
            console.error("Error in resetBossProgress:", error);
            throw error;
        }
    }

    async getAvailableBossId(userId) {
        try {
            validateUserId(userId);

            const progress = await this.getBossProgress(userId);

            return progress.currentAvailableBossId;
        } catch (error) {
            console.error("Error in getAvailableBossId:", error);
            throw error;
        }
    }
}

const bossProgressService = new BossProgressService();

export { bossProgressService };
