import { isValidObjectId } from "mongoose";
import ApiError from "../../shared/exceptions/api-error.js";
import TaskModel from "../models/tasks-model.js";
import userStatsService from "../../stats/services/user-stats-service.js";
import bossService from "../../boss/services/boss-service.js";
import DIFFICULTY_REWARDS from "../../shared/config/user-stats-config.js";

const validateIds = (...ids) => {
    for (const id of ids) {
        if (!isValidObjectId(id)) {
            throw ApiError.BadRequest("Invalid ID");
        }
    }
};

const getAllTasks = async (userId) => {
    validateIds(userId);
    return TaskModel.find({ user: userId }).sort({ createdAt: -1 });
};

const createTask = async ({ text, deadline, difficulty }, userId) => {
    validateIds(userId);

    if (!text?.trim()) throw ApiError.BadRequest("Text is required");
    if (!DIFFICULTY_REWARDS[difficulty])
        throw ApiError.BadRequest("Invalid difficulty");

    return TaskModel.create({
        user: userId,
        text: text.trim(),
        deadline,
        difficulty,
    });
};

const removeTask = async (taskId, userId) => {
    validateIds(taskId, userId);

    const deleted = await TaskModel.findOneAndDelete({
        _id: taskId,
        user: userId,
    });

    if (!deleted) throw ApiError.BadRequest("Task not found");
};

const completeTask = async (taskId, userId) => {
    validateIds(taskId, userId);

    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) throw ApiError.BadRequest("Task not found");
    if (task.isCompleted) throw ApiError.BadRequest("Task already completed");

    task.isCompleted = true;
    await task.save();

    const reward = DIFFICULTY_REWARDS[task.difficulty] || { xp: 0, damage: 0 };
    const xp = !task.deadline ? Math.floor(reward.xp / 5) : reward.xp;

    const { stats, message: levelUpMessage } =
        await userStatsService.gainExperience(userId, xp);

    let allMessages = [];

    allMessages.push(`✅ Mission accomplished! Received ${xp} XP`);

    if (levelUpMessage) {
        allMessages.push(`🎉 ${levelUpMessage}`);
    }

    const boss = await bossService.getBoss(userId);

    if (boss && task.deadline && task.createdAt > boss.spawnedAt) {
        const bossResult = await bossService.damageBoss(userId, reward.damage);

        if (bossResult.messages) {
            allMessages.push(...bossResult.messages);
        }
    }

    return {
        task,
        stats,
        messages: allMessages,
    };
};

const applyOverduePenalty = async (taskId, userId) => {
    validateIds(taskId, userId);

    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) throw ApiError.BadRequest("Task not found");
    if (task.damageTaken) throw ApiError.BadRequest("Already penalized");

    task.damageTaken = true;
    await task.save();

    const { damage } = DIFFICULTY_REWARDS[task.difficulty] || {};
    const stats = await userStatsService.takeDamage(userId, damage || 0);

    let allMessages = [];

    allMessages.push(`⚠️ Penalty applied! Lost ${damage} XP`);

    if (stats.healthPoints <= 0) {
        allMessages.push(`Your health is over!`);
    }

    const boss = await bossService.getBoss(userId);

    if (boss && task.deadline && task.createdAt > boss.spawnedAt) {
        const rageResult = await bossService.addRage(userId, [taskId]);

        if (rageResult.messages) {
            allMessages.push(...rageResult.messages);
        }
    }

    return {
        task,
        stats,
        messages: allMessages,
    };
};

export default {
    getAllTasks,
    createTask,
    completeTask,
    removeTask,
    applyOverduePenalty,
};
