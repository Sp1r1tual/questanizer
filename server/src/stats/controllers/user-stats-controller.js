import userStatsService from "../services/user-stats-service.js";

const getStats = async (req, res, next) => {
    try {
        const stats = await userStatsService.getByUserId(req.user.id);

        res.json(stats);
    } catch (err) {
        next(err);
    }
};

const gainExperience = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const updatedStats = await userStatsService.gainExperience(
            req.user.id,
            amount
        );

        res.json(updatedStats);
    } catch (err) {
        next(err);
    }
};

const takeDamage = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const updatedStats = await userStatsService.takeDamage(
            req.user.id,
            amount
        );

        res.json(updatedStats);
    } catch (err) {
        next(err);
    }
};

const resetStats = async (req, res, next) => {
    try {
        const reset = await userStatsService.resetStats(req.user.id);

        res.json(reset);
    } catch (err) {
        next(err);
    }
};

export default {
    getStats,
    gainExperience,
    takeDamage,
    resetStats,
};
