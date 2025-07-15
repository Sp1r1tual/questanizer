import ApiError from "../../shared/exceptions/api-error.js";
import BossModel from "../models/boss-model.js";
import bosses from "../data/bosses.js";
import userStatsService from "../../stats/services/user-stats-service.js";
import bossProgressService from "./boss-progress-service.js";
import {
    validateObjectId,
    hasBossFound,
    updateBossFromTemplate,
} from "../helpers/boss-helpers.js";

const getBoss = async (userId) => {
    validateObjectId(userId, "user ID");
    return BossModel.findOne({ user: userId });
};

const spawnBoss = async (userId, bossId) => {
    validateObjectId(userId, "user ID");

    const config = bosses.find((boss) => boss.bossId === bossId);

    if (!config) {
        return {
            boss: null,
            messages: [
                {
                    type: "success",
                    text: "You have defeated all available bosses!",
                },
            ],
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
};

const damageBoss = async (userId, amount) => {
    validateObjectId(userId, "user ID");

    if (typeof amount !== "number" || amount <= 0)
        throw ApiError.BadRequest("Invalid damage amount");

    const boss = await hasBossFound(userId);

    boss.healthPoints = Math.max(0, boss.healthPoints - amount);

    const isDead = boss.healthPoints <= 0;

    if (isDead) {
        await userStatsService.gainExperience(userId, boss.bossRewardExp);

        const progress = await bossProgressService.updateBossProgress(
            userId,
            boss.bossId,
            boss.bossRewardExp
        );

        await boss.deleteOne();

        const allBossesDefeated =
            progress.currentAvailableBossId > bosses.length;

        const messages = [
            {
                type: "success",
                text: `Congratulations! You defeated the boss ${boss.bossName}!`,
            },
            {
                type: "info",
                text: `Received ${boss.bossRewardExp} XP!`,
            },
        ];

        return {
            healthPoints: 0,
            isDead: true,
            rewardExp: boss.bossRewardExp,
            allBossesDefeated,
            messages,
        };
    }

    await boss.save();

    return {
        healthPoints: boss.healthPoints,
        isDead: false,
        messages: [
            {
                type: "info",
                text: `Dealt ${amount} damage to boss!`,
            },
        ],
    };
};

const addRage = async (userId, newTaskIds = []) => {
    validateObjectId(userId, "user ID");

    if (!Array.isArray(newTaskIds))
        throw ApiError.BadRequest("newTaskIds must be an array");

    const boss = await hasBossFound(userId);
    const uniqueNew = newTaskIds.filter(
        (id) => !boss.alreadyRagedTaskIds.includes(id)
    );

    boss.alreadyRagedTaskIds.push(...uniqueNew);
    boss.rage += uniqueNew.length;

    let shouldAttack = false;
    let stats = null;
    let messages = [];

    if (uniqueNew.length > 0) {
        messages.push({
            type: "info",
            text: `Boss's Rage increased by ${uniqueNew.length}! (${boss.rage}/${boss.bossRageBar})`,
        });
    }

    if (boss.rage >= boss.bossRageBar) {
        boss.rage = 0;
        shouldAttack = true;
        stats = await userStatsService.takeDamage(userId, boss.bossPower);

        messages.push({
            type: "warning",
            text: `The boss is attacking! Assigned ${boss.bossPower} damage!`,
        });

        if (stats.healthPoints <= 0) {
            messages.push({
                type: "error",
                text: `You lost! Your health is gone.`,
            });
        }
    }

    await boss.save();
    return {
        rage: boss.rage,
        shouldAttack,
        stats,
        messages,
    };
};

const markTaskAsRaged = async (userId, taskId) => {
    validateObjectId(userId, "user ID");

    const boss = await hasBossFound(userId);

    if (!boss.alreadyRagedTaskIds.includes(taskId)) {
        boss.alreadyRagedTaskIds.push(taskId);
        await boss.save();
    }

    return {
        alreadyRagedTaskIds: boss.alreadyRagedTaskIds,
    };
};

const resetBoss = async (userId) => {
    const boss = await BossModel.findOne({ user: userId });

    if (boss) {
        await boss.deleteOne();
    }

    await bossProgressService.resetBossProgress(userId);

    return { boss: null, rewardGiven: false };
};

export default {
    getBoss,
    spawnBoss,
    damageBoss,
    addRage,
    markTaskAsRaged,
    resetBoss,
};
