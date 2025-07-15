import UserStatsModel from "../models/user-stats-model.js";
import bossService from "../../boss/services/boss-service.js";

const getOrCreateStats = async (userId) => {
    let stats = await UserStatsModel.findOne({ user: userId });

    if (!stats) {
        stats = await UserStatsModel.create({ user: userId });
    }

    return stats;
};

const gainExperience = async (userId, amount) => {
    const stats = await getOrCreateStats(userId);

    const oldLevel = stats.level;

    stats.xp += amount;

    while (stats.xp >= stats.level * 100) {
        stats.xp -= stats.level * 100;
        stats.level += 1;
        stats.hp = stats.maxHp;
    }

    let message = null;
    if (stats.level > oldLevel) {
        message = `Your level has increased: ${stats.level}!`;
    }

    await stats.save();

    return { stats, message };
};

const takeDamage = async (userId, amount) => {
    const stats = await getOrCreateStats(userId);

    if (stats.hp <= 0) return stats;

    stats.hp -= amount;

    if (stats.hp < 0) stats.hp = 0;

    await stats.save();
    return stats;
};

const resetUserStats = async (userId) => {
    const stats = await getOrCreateStats(userId);

    stats.xp = 0;
    stats.level = 1;
    stats.hp = 100;
    stats.maxHp = 100;
    stats.xpToNextLevel = 100;

    await bossService.resetBoss(userId);
    await stats.save();
    return { message: `Player progress reset`, stats };
};

export default {
    getOrCreateStats,
    gainExperience,
    takeDamage,
    resetUserStats,
};
