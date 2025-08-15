import { localizationMessages } from "../../utils/localization/localize-messages.js";

const bossNotifications = {
    allDefeated: (userId) =>
        localizationMessages(userId, "success", "boss.noMoreBosses"),

    defeated: (userId, bossName) =>
        localizationMessages(userId, "success", "boss.defeatBoss", {
            bossName,
        }),

    damaged: (userId, amount) =>
        localizationMessages(userId, "info", "boss.dealtDamage", {
            amount,
        }),

    rage: (userId, value, rage, rageBar) =>
        localizationMessages(userId, "info", "boss.increaseRage", {
            value,
            rage,
            rageBar,
        }),

    attack: (userId, bossPower) =>
        localizationMessages(userId, "warning", "boss.bossAttacking", {
            boss: { bossPower },
        }),

    reward: (userId, exp, gold) =>
        localizationMessages(userId, "success", "boss.reward", { exp, gold }),
};

const statsNotifications = {
    levelUp: (userId, level) =>
        localizationMessages(userId, "success", "stats.levelUp", { level }),

    defeated: (userId) =>
        localizationMessages(userId, "error", "stats.defeated"),

    reset: (userId) => localizationMessages(userId, "info", "stats.reset"),
};

const inventoryNotifications = {
    useItem: (userId, item) =>
        localizationMessages(userId, "success", "inventory.useItem", {
            item,
        }),

    fullHp: (userId) =>
        localizationMessages(userId, "error", "inventory.fullHp"),
};

const marketNotifications = {
    checkout: (userId, totalItems) =>
        localizationMessages(userId, "success", "market.purchase", {
            totalItems,
        }),

    spent: (userId, totalPrice) =>
        localizationMessages(userId, "info", "market.spent", { totalPrice }),

    notEnoughtGold: (userId) =>
        localizationMessages(userId, "error", "market.notEnoughtGold"),
};

const tasksNotifications = {
    complete: (userId, xp, gold) =>
        localizationMessages(userId, "success", "tasks.complete", {
            xp,
            gold,
        }),

    penalty: (userId, damage) =>
        localizationMessages(userId, "warning", "tasks.penalty", {
            damage,
        }),
};

export {
    bossNotifications,
    statsNotifications,
    inventoryNotifications,
    marketNotifications,
    tasksNotifications,
};
