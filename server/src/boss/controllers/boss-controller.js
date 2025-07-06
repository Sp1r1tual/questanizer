import mongoose from "mongoose";
import ApiError from "../../shared/exceptions/api-error.js";
import bossService from "../services/boss-service.js";
import BossModel from "../models/boss-model.js";
import userStatsService from "../../stats/services/user-stats-service.js";
import bossProgressService from "../services/boss-progress-service.js";

const getBoss = async (req, res, next) => {
    try {
        const boss = req.boss;
        const progress = await bossProgressService.getBossProgress(req.user.id);

        res.json({
            boss: boss || null,
            progress,
        });
    } catch (error) {
        next(error);
    }
};

const spawnBoss = async (req, res, next) => {
    try {
        const progress = await bossProgressService.getBossProgress(req.user.id);

        const spawnId =
            req.body?.bossId ?? progress.currentAvailableBossId ?? 1;

        const boss = await bossService.spawnBoss(req.user.id, spawnId);

        res.status(201).json(boss);
    } catch (error) {
        next(error);
    }
};

const resetBoss = async (req, res, next) => {
    try {
        const { boss, rewardGiven } = await bossService.resetBoss(req.user.id);
        const progress = await bossProgressService.getBossProgress(req.user.id);

        res.json({ boss, progress, rewardGiven });
    } catch (error) {
        next(error);
    }
};

const damageBoss = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (typeof amount !== "number" || amount <= 0) {
            return next(ApiError.BadRequest("Invalid damage amount"));
        }

        const result = await bossService.damageBoss(req.user.id, amount);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const rageBoss = async (req, res, next) => {
    try {
        const { taskIds = [] } = req.body;

        if (!Array.isArray(taskIds)) {
            return next(ApiError.BadRequest("taskIds must be an array"));
        }

        const result = await bossService.addRage(req.user.id, taskIds);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const markTaskAsRaged = async (req, res, next) => {
    try {
        const { taskId } = req.body;

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return next(ApiError.BadRequest("Invalid taskId"));
        }

        const result = await bossService.markTaskAsRaged(req.user.id, taskId);

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const rewardUser = async (req, res, next) => {
    try {
        const boss = await BossModel.findOne({ user: req.user.id });

        if (!boss) return next(ApiError.BadRequest("Boss not found"));

        await userStatsService.gainExperience(req.user.id, boss.bossRewardExp);
        await boss.deleteOne();

        res.json({
            message: "Boss defeated, XP awarded",
            xp: boss.bossRewardExp,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getBoss,
    spawnBoss,
    resetBoss,
    damageBoss,
    rageBoss,
    markTaskAsRaged,
    rewardUser,
};
