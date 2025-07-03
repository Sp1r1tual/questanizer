import TaskModel from "../models/tasks-model.js";
import ApiError from "../../shared/exceptions/api-error.js";
import DIFFICULTY_REWARDS from "../../shared/config/user-stats-config.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";
import userStatsService from "../../stats/services/user-stats-service.js";

const getAllTasks = (userId) => {
    return TaskModel.find({ user: userId });
};

const createTask = ({ text, deadline, difficulty, userId }) => {
    return new TaskModel({ text, deadline, difficulty, user: userId }).save();
};

const toggleTaskAsComplete = async (id, userId) => {
    const task = await TaskModel.findOne({ _id: id, user: userId });

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);

    task.isCompleted = !task.isCompleted;
    return task.save();
};

const deleteTaskById = async (id, userId) => {
    const task = await TaskModel.findOneAndDelete({ _id: id, user: userId });

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
};

const completeTaskAndReward = async (taskId, userId) => {
    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
    if (task.isCompleted)
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskAlreadyCompleted);

    task.isCompleted = true;
    await task.save();

    const reward = DIFFICULTY_REWARDS[task.difficulty] || { xp: 0 };

    const xpToAdd = !task.deadline ? Math.floor(reward.xp / 5) : reward.xp;

    const updatedStats = await userStatsService.gainExperience(userId, xpToAdd);

    return { task, stats: updatedStats };
};

const applyTaskOverdueDamage = async (taskId, userId) => {
    const task = await TaskModel.findOne({ _id: taskId, user: userId });

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
    if (task.damageTaken)
        throw ApiError.BadRequest(RESPONSE_MESSAGES.taskAlreadyDamaged);

    task.damageTaken = true;
    await task.save();

    const penalty = DIFFICULTY_REWARDS[task.difficulty] || { damage: 0 };
    const updatedStats = await userStatsService.takeDamage(
        userId,
        penalty.damage
    );

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
