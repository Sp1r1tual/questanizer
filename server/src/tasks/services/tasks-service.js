import { TaskModel } from "../models/tasks-model.js";

import { userStatsService } from "../../stats/services/user-stats-service.js";
import { bossService } from "../../boss/services/boss-service.js";

import { ApiError } from "../../shared/exceptions/api-error.js";
import { DIFFICULTY_REWARDS } from "../../shared/configs/user-stats-config.js";
import {
    validateUserId,
    validateTaskAndUserIds,
} from "../../shared/utils/validations/validate-object-id.js";
import { tasksNotifications } from "../../shared/utils/notifications/notification-factory.js";

class TasksService {
    async getAllTasks(userId) {
        validateUserId(userId);

        return TaskModel.find({ user: userId }).sort({ createdAt: -1 });
    }

    async createTask({ text, deadline, difficulty }, userId) {
        validateUserId(userId);

        if (!text?.trim()) {
            throw ApiError.BadRequest("Text is required");
        }

        if (!DIFFICULTY_REWARDS[difficulty]) {
            throw ApiError.BadRequest("Invalid difficulty");
        }

        return TaskModel.create({
            user: userId,
            text: text.trim(),
            deadline,
            difficulty,
        });
    }

    async removeTask(taskId, userId) {
        validateTaskAndUserIds(taskId, userId);

        const deleted = await TaskModel.findOneAndDelete({
            _id: taskId,
            user: userId,
        });

        if (!deleted) {
            throw ApiError.NotFound("Task not found");
        }
    }

    async completeTask(taskId, userId) {
        validateTaskAndUserIds(taskId, userId);

        const task = await TaskModel.findOne({ _id: taskId, user: userId });

        if (!task) {
            throw ApiError.NotFound("Task not found");
        }

        if (task.isCompleted) {
            throw ApiError.Conflict("Task already completed");
        }

        const reward = DIFFICULTY_REWARDS[task.difficulty] || {
            xp: 0,
            damage: 0,
            gold: 0,
        };

        const xp = !task.deadline ? Math.floor(reward.xp / 5) : reward.xp;
        const gold = !task.deadline ? Math.floor(reward.gold / 5) : reward.gold;

        const now = new Date();
        const boss = await bossService.getBoss(userId);

        const isEligibleToDamage =
            boss && task.deadline && new Date(task.deadline) > now;

        let bossResult = null;

        if (isEligibleToDamage) {
            bossResult = await bossService.damageBoss(userId, reward.damage);
        }

        task.isCompleted = true;

        await task.save();

        await userStatsService.gainGold(userId, gold);

        const { stats, message: levelUpMessage } =
            await userStatsService.gainExperience(userId, xp);

        const messages = [await tasksNotifications.complete(userId, xp, gold)];

        if (levelUpMessage) messages.push(levelUpMessage);

        if (bossResult?.messages) {
            messages.push(
                ...bossResult.messages.map((msg) =>
                    typeof msg === "string" ? info(msg) : msg
                )
            );
        }

        return { task, stats, messages };
    }

    async applyOverduePenalty(taskId, userId) {
        validateTaskAndUserIds(taskId, userId);

        const task = await TaskModel.findOne({ _id: taskId, user: userId });

        if (!task) {
            throw ApiError.NotFound("Task not found");
        }

        if (task.damageTaken) {
            throw ApiError.Conflict("Already penalized");
        }

        task.damageTaken = true;
        await task.save();

        const { damage = 0 } = DIFFICULTY_REWARDS[task.difficulty] || {};
        const { stats, message: hpZeroMessage } =
            await userStatsService.takeDamage(userId, damage);

        const messages = [await tasksNotifications.penalty(userId, damage)];

        if (hpZeroMessage) messages.push(hpZeroMessage);

        const boss = await bossService.getBoss(userId);
        const createdAfterBossSpawned =
            boss && task.deadline && task.createdAt > boss.spawnedAt;

        if (createdAfterBossSpawned) {
            const rageResult = await bossService.addRage(userId, [taskId]);

            if (rageResult.messages?.length) {
                const formattedMessages = rageResult.messages.map((msg) =>
                    typeof msg === "string" ? info(msg) : msg
                );
                messages.push(...formattedMessages);
            }
        }

        return { task, stats, messages };
    }
}

const tasksService = new TasksService();

export { tasksService };
