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

    if (!config) throw ApiError.BadRequest("Invalid boss ID");

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
    return boss;
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
        await bossProgressService.updateBossProgress(
            userId,
            boss.bossId,
            boss.bossRewardExp
        );
        await boss.deleteOne();

        return {
            message: `Boss defeated! Gained ${boss.bossRewardExp} XP`,
            healthPoints: 0,
            isDead: true,
            rewardExp: boss.bossRewardExp,
            event: "BOSS_DEFEATED",
        };
    }

    await boss.save();
    return {
        message: `Boss damaged by ${amount}`,
        healthPoints: boss.healthPoints,
        isDead: false,
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

    if (boss.rage >= boss.bossRageBar) {
        boss.rage = 0;
        shouldAttack = true;
        stats = await userStatsService.takeDamage(userId, boss.bossPower);
    }

    await boss.save();
    return {
        message: `Rage increased by ${uniqueNew.length}`,
        rage: boss.rage,
        shouldAttack,
        stats,
        event: shouldAttack ? "BOSS_ATTACKED" : null,
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
        message: "Task marked as raged",
        alreadyRagedTaskIds: boss.alreadyRagedTaskIds,
    };
};

const resetBoss = async (userId) => {
    const boss = await hasBossFound(userId);
    const isDefeated = boss.healthPoints <= 0;

    if (!isDefeated) {
        await boss.deleteOne();
        await bossProgressService.resetBossProgress(userId);
        return { boss: null, rewardGiven: false };
    }

    const rewardExp = boss.bossRewardExp;
    const currentBossId = boss.bossId;
    const nextBoss = bosses.find((b) => b.bossId === currentBossId + 1);

    await userStatsService.gainExperience(userId, rewardExp);
    await bossProgressService.updateBossProgress(
        userId,
        currentBossId,
        rewardExp
    );

    if (!nextBoss) {
        await boss.deleteOne();
        return {
            boss: null,
            rewardGiven: true,
            event: "ALL_BOSSES_DEFEATED",
        };
    }

    updateBossFromTemplate(boss, nextBoss);

    Object.assign(boss, {
        rage: 0,
        alreadyRagedTaskIds: [],
        currentBossIndex: boss.currentBossIndex + 1,
        spawnedAt: new Date(),
    });

    await boss.save();

    return { boss, rewardGiven: true };
};

export default {
    getBoss,
    spawnBoss,
    damageBoss,
    addRage,
    markTaskAsRaged,
    resetBoss,
};
