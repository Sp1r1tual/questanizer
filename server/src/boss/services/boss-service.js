import { ApiError } from "../../shared/exceptions/api-error.js";
import { BossModel } from "../models/boss-model.js";
import { bosses } from "../data/bosses.js";
import { userStatsService } from "../../stats/services/user-stats-service.js";
import { bossProgressService } from "./boss-progress-service.js";
import { hasBossFound } from "../helpers/has-boss-found.js";
import { updateBossFromTemplate } from "../utils/update-boss-from-template.js";
import { validateObjectId } from "../../shared/utils/validations/validate-object-id.js";
import {
    success,
    info,
    warning,
} from "../../shared/utils/notifications/notifications.js";

class BossService {
    async getBoss(userId) {
        validateObjectId(userId, "user ID");

        return BossModel.findOne({ user: userId });
    }

    async spawnBoss(userId, bossId) {
        validateObjectId(userId, "user ID");

        const config = bosses.find((boss) => boss.bossId === bossId);

        if (!config) {
            return {
                boss: null,
                messages: [success("You have defeated all available bosses!")],
                allBossesDefeated: true,
            };
        }

        let boss = await BossModel.findOne({ user: userId });

        if (!boss) boss = new BossModel({ user: userId });

        updateBossFromTemplate(boss, config);
        Object.assign(boss, {
            rage: 0,
            alreadyRagedTaskIds: [],
            currentBossIndex: bossId - 1,
            spawnedAt: new Date(),
        });

        await boss.save();

        return {
            boss,
            allBossesDefeated: false,
        };
    }

    async damageBoss(userId, amount) {
        validateObjectId(userId, "user ID");

        if (typeof amount !== "number" || amount <= 0) {
            throw ApiError.BadRequest("Invalid damage amount");
        }

        const boss = await hasBossFound(userId);

        boss.healthPoints = Math.max(0, boss.healthPoints - amount);

        const isDead = boss.healthPoints <= 0;

        if (isDead) {
            await userStatsService.gainExperience(userId, boss.bossRewardExp);
            await userStatsService.gainGold(userId, boss.bossRewardGold);

            const progress = await bossProgressService.updateBossProgress(
                userId,
                boss.bossId,
                boss.bossRewardExp
            );

            await boss.deleteOne();

            const allBossesDefeated =
                progress.currentAvailableBossId > bosses.length;

            return {
                healthPoints: 0,
                isDead: true,
                rewardExp: boss.bossRewardExp,
                allBossesDefeated,
                messages: [
                    success(
                        `Congratulations! You defeated the boss ${boss.bossName}!`
                    ),
                    info(`Received ${boss.bossRewardExp} XP!`),
                    info(`Received ${boss.bossRewardGold} gold!`),
                ],
            };
        }

        await boss.save();

        return {
            healthPoints: boss.healthPoints,
            isDead: false,
            messages: [info(`Dealt ${amount} damage to boss!`)],
        };
    }

    async addRage(userId, newTaskIds = []) {
        validateObjectId(userId, "user ID");

        if (!Array.isArray(newTaskIds)) {
            throw ApiError.BadRequest("newTaskIds must be an array");
        }

        const boss = await hasBossFound(userId);
        const uniqueNew = newTaskIds.filter(
            (id) => !boss.alreadyRagedTaskIds.includes(id)
        );

        boss.alreadyRagedTaskIds.push(...uniqueNew);
        boss.rage += uniqueNew.length;

        let shouldAttack = false;
        let stats = null;
        const messages = [];

        if (uniqueNew.length > 0) {
            messages.push(
                info(
                    `Boss's Rage increased by ${uniqueNew.length}! (${boss.rage}/${boss.bossRageBar})`
                )
            );
        }

        if (boss.rage >= boss.bossRageBar) {
            boss.rage = 0;
            shouldAttack = true;

            const result = await userStatsService.takeDamage(
                userId,
                boss.bossPower
            );
            stats = result.stats;

            messages.push(
                warning(
                    `The boss is attacking! Assigned ${boss.bossPower} damage!`
                )
            );

            if (result.message) {
                messages.push(result.message);
            }
        }

        await boss.save();

        return {
            rage: boss.rage,
            shouldAttack,
            stats,
            messages,
        };
    }

    async markTaskAsRaged(userId, taskId) {
        validateObjectId(userId, "user ID");

        const boss = await hasBossFound(userId);

        if (!boss.alreadyRagedTaskIds.includes(taskId)) {
            boss.alreadyRagedTaskIds.push(taskId);
            await boss.save();
        }

        return {
            alreadyRagedTaskIds: boss.alreadyRagedTaskIds,
        };
    }

    async resetBoss(userId) {
        const boss = await BossModel.findOne({ user: userId });

        if (boss) {
            await boss.deleteOne();
        }

        await bossProgressService.resetBossProgress(userId);

        return {
            boss: null,
            rewardGiven: false,
        };
    }
}

const bossService = new BossService();

export { bossService };
