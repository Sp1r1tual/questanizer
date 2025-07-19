import bossService from "../services/boss-service.js";
import bossProgressService from "../services/boss-progress-service.js";

const getBoss = async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        let boss = req.boss;
        if (!boss) {
            boss = await bossService.getBoss(userId);
        }

        const progress = await bossProgressService.getBossProgress(userId);

        res.json({ boss: boss || null, progress });
    } catch (error) {
        next(error);
    }
};

const spawnBoss = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const progress = await bossProgressService.getBossProgress(userId);

        const requestedBossId = Number(req.body?.bossId);
        const bossId =
            Number.isInteger(requestedBossId) && requestedBossId > 0
                ? requestedBossId
                : progress.currentAvailableBossId || 1;

        const boss = await bossService.spawnBoss(userId, bossId);

        res.status(201).json(boss);
    } catch (error) {
        next(error);
    }
};

export default {
    getBoss,
    spawnBoss,
};
