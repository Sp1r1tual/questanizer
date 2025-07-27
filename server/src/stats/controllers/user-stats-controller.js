import { userStatsService } from "../services/user-stats-service.js";

const getStats = async (req, res, next) => {
    try {
        const stats = await userStatsService.getOrCreateStats(req.user.id);

        return res.json(stats);
    } catch (error) {
        next(error);
    }
};

const resetUserStats = async (req, res, next) => {
    try {
        const reset = await userStatsService.resetUserStats(req.user.id);

        return res.json(reset);
    } catch (error) {
        next(error);
    }
};

export { getStats, resetUserStats };
