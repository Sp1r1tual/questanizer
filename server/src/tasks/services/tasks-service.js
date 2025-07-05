import mongoose from "mongoose";
import ApiError from "../../shared/exceptions/api-error.js";
import TaskModel from "../models/tasks-model.js";
import DIFFICULTY_REWARDS from "../../shared/config/user-stats-config.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";
import userStatsService from "../../stats/services/user-stats-service.js";
import bossService from "../../boss/services/boss-service.js";

const getAllTasks = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.BadRequest("Invalid user ID");
    }

    return TaskModel.find({ user: userId }).sort({ createdAt: -1 });
};

const createTask = async ({ text, deadline, difficulty, userId }) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.BadRequest("Invalid user ID");
    }

    if (!text || text.trim().length === 0) {
        throw ApiError.BadRequest("Task text is required");
    }

    if (!difficulty || !DIFFICULTY_REWARDS[difficulty]) {
        throw ApiError.BadRequest("Invalid difficulty level");
    }

    return new TaskModel({
        text: text.trim(),
        deadline,
        difficulty,
        user: userId,
    }).save();
};

const toggleTaskAsComplete = async (id, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.BadRequest("Invalid task ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.BadRequest("Invalid user ID");
    }

    const task = await TaskModel.findOne({ _id: id, user: userId });

    if (!task) {
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
    }

    task.isCompleted = !task.isCompleted;
    return task.save();
};

const deleteTaskById = async (id, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw ApiError.BadRequest("Invalid task ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.BadRequest("Invalid user ID");
    }

    const task = await TaskModel.findOneAndDelete({ _id: id, user: userId });

    if (!task) {
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
    }

    return task;
};

const completeTaskAndReward = async (taskId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw ApiError.BadRequest("Invalid task ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.BadRequest("Invalid user ID");
    }

    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) {
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
    }

    if (task.isCompleted) {
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskAlreadyCompleted);
    }

    task.isCompleted = true;
    await task.save();

    const reward = DIFFICULTY_REWARDS[task.difficulty] || { xp: 0, damage: 0 };
    const xpToAdd = !task.deadline ? Math.floor(reward.xp / 5) : reward.xp;
    const updatedStats = await userStatsService.gainExperience(userId, xpToAdd);

    const boss = await bossService.getBoss(userId);

    if (boss && task.deadline && task.createdAt > boss.spawnedAt) {
        await bossService.damageBoss(userId, reward.damage);
    }

    return { task, stats: updatedStats };
};

const applyTaskOverdueDamage = async (taskId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        throw ApiError.BadRequest("Invalid task ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw ApiError.BadRequest("Invalid user ID");
    }

    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) {
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
    }

    if (task.damageTaken) {
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskAlreadyDamaged);
    }

    task.damageTaken = true;
    await task.save();

    const penalty = DIFFICULTY_REWARDS[task.difficulty] || { damage: 0 };

    const updatedStats = await userStatsService.takeDamage(
        userId,
        penalty.damage
    );

    const boss = await bossService.getBoss(userId);

    if (boss && task.deadline && task.createdAt > boss.spawnedAt) {
        await bossService.addRage(userId, [taskId]);
    }

    return { task, stats: updatedStats };
};

export {
    getAllTasks,
    createTask,
    toggleTaskAsComplete,
    deleteTaskById,
    completeTaskAndReward,
    applyTaskOverdueDamage,
};
