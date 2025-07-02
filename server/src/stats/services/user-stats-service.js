import UserStatsModel from "../models/user-stats-model.js";

const getByUserId = async (userId) => {
    let stats = await UserStatsModel.findOne({ user: userId });

    if (!stats) {
        stats = await UserStatsModel.create({ user: userId });
    }

    return stats;
};

const gainExperience = async (userId, amount) => {
    const stats = await getByUserId(userId);

    stats.xp += amount;

    while (stats.xp >= stats.level * 100) {
        stats.xp -= stats.level * 100;
        stats.level += 1;
        stats.hp = stats.maxHp;
    }

    await stats.save();
    return stats;
};

const takeDamage = async (userId, amount) => {
    const stats = await getByUserId(userId);

    if (stats.hp <= 0) {
        return stats;
    }

    stats.hp -= amount;

    if (stats.hp < 0) stats.hp = 0;

    await stats.save();
    return stats;
};

const resetStats = async (userId) => {
    const stats = await getByUserId(userId);

    stats.xp = 0;
    stats.level = 1;
    stats.hp = 100;
    stats.maxHp = 100;
    stats.xpToNextLevel = 100;

    await stats.save();
    return stats;
};

export default {
    getByUserId,
    gainExperience,
    takeDamage,
    resetStats,
};
