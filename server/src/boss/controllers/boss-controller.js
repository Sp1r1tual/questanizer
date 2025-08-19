import { bossService } from "../services/boss-service.js";
import { bossProgressService } from "../services/boss-progress-service.js";

const getBossController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const boss = await bossService.getBoss(userId);
    const progress = await bossProgressService.getBossProgress(userId);

    return res.json({ boss: boss || null, progress });
  } catch (error) {
    next(error);
  }
};

const spawnBossController = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const progress = await bossProgressService.getBossProgress(userId);

    const requestedBossId = Number(req.body?.bossId);
    const bossId =
      Number.isInteger(requestedBossId) && requestedBossId > 0
        ? requestedBossId
        : progress.currentAvailableBossId || 1;

    const boss = await bossService.spawnBoss(userId, bossId);

    return res.json(boss);
  } catch (error) {
    next(error);
  }
};

export { getBossController, spawnBossController };
