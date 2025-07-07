import userStatsService from "../services/user-stats-service.js";

const getStats = async (req, res, next) => {
    try {
        const stats = await userStatsService.getOrCreateStats(req.user.id);

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const resetUserStats = async (req, res, next) => {
    try {
        const reset = await userStatsService.resetUserStats(req.user.id);

        res.json(reset);
    } catch (error) {
        next(error);
    }
};

export default {
    getStats,
    resetUserStats,
};
