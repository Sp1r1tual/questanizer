import BossModel from "../models/boss-model.js";
import bosses from "../data/bosses.js";
import userStatsService from "../../stats/services/user-stats-service.js";
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

    const config = bosses.find((b) => b.bossId === bossId);

    if (!config) throw new Error("Invalid boss ID");

    const existing = await BossModel.findOne({ user: userId });

    if (existing) await existing.deleteOne();

    return BossModel.create({
        user: userId,
        bossId: config.bossId,
        bossName: config.bossName,
        healthPoints: config.healthPoints,
        maxHealthPoints: config.healthPoints,
        bossPower: config.bossPower,
        bossRewardExp: config.bossRewardExp,
        bossRageBar: config.bossRageBar,
        bossImg: config.bossImg,
        rage: 0,
        alreadyRagedTaskIds: [],
        currentBossIndex: bossId - 1,
        spawnedAt: new Date(),
    });
};

const damageBoss = async (userId, amount) => {
    validateObjectId(userId, "user ID");

    if (typeof amount !== "number" || amount <= 0) {
        throw new Error("Invalid damage amount");
    }

    const boss = await hasBossFound(userId);

    boss.healthPoints = Math.max(0, boss.healthPoints - amount);
    await boss.save();

    return {
        message: `Boss damaged by ${amount}`,
        healthPoints: boss.healthPoints,
        isDead: boss.healthPoints <= 0,
    };
};

const addRage = async (userId, newTaskIds = []) => {
    validateObjectId(userId, "user ID");

    if (!Array.isArray(newTaskIds)) {
        throw new Error("newTaskIds must be an array");
    }

    const boss = await hasBossFound(userId);
    const newUniqueTasks = newTaskIds.filter(
        (id) => !boss.alreadyRagedTaskIds.includes(id)
    );

    boss.alreadyRagedTaskIds.push(...newUniqueTasks);
    boss.rage += newUniqueTasks.length;

    let shouldAttack = false;
    let stats = null;

    if (boss.rage >= boss.bossRageBar) {
        boss.rage = 0;
        shouldAttack = true;
        stats = await userStatsService.takeDamage(userId, boss.bossPower);
    }

    await boss.save();

    return {
        message: `Rage increased by ${newUniqueTasks.length}`,
        rage: boss.rage,
        shouldAttack,
        stats,
    };
};

const markTaskAsRaged = async (userId, taskId) => {
    validateObjectId(userId, "user ID");
    validateObjectId(taskId, "task ID");

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
    const wasDefeated = boss.healthPoints <= 0;
    let rewardGiven = false;

    if (wasDefeated) {
        await userStatsService.gainExperience(userId, boss.bossRewardExp);
        rewardGiven = true;

        const next = bosses.find((b) => b.bossId === boss.bossId + 1);

        if (next) {
            updateBossFromTemplate(boss, next);
            boss.currentBossIndex += 1;
        } else {
            boss.healthPoints = boss.maxHealthPoints;
        }
    } else {
        boss.healthPoints = boss.maxHealthPoints;
    }

    boss.rage = 0;
    boss.alreadyRagedTaskIds = [];
    boss.spawnedAt = new Date();
    await boss.save();

    return { boss, rewardGiven };
};

export default {
    getBoss,
    spawnBoss,
    damageBoss,
    addRage,
    markTaskAsRaged,
    resetBoss,
};
