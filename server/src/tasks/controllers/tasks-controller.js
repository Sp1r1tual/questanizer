import {
    getAllTasks,
    createTask,
    toggleTaskAsComplete,
    deleteTaskById,
    completeTaskAndReward,
    applyTaskOverdueDamage,
} from "../services/tasks-service.js";

import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";

const getTasks = async (req, res, next) => {
    try {
        const tasks = await getAllTasks(req.user.id);

        return res.json(tasks);
    } catch (error) {
        return next(error);
    }
};

const addTask = async (req, res, next) => {
    try {
        const { text, deadline, difficulty } = req.body;
        const task = await createTask({
            text,
            deadline,
            difficulty,
            userId: req.user.id,
        });

        return res.status(201).json(task);
    } catch (error) {
        return next(error);
    }
};

const toggleCompleteTask = async (req, res, next) => {
    try {
        const task = await toggleTaskAsComplete(req.params.id, req.user.id);

        return res.json(task);
    } catch (error) {
        return next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        await deleteTaskById(req.params.id, req.user.id);
        return res.json({ message: RESPONSE_MESSAGES.taskDeleted });
    } catch (error) {
        return next(error);
    }
};

const completeTask = async (req, res, next) => {
    try {
        const { task, stats } = await completeTaskAndReward(
            req.params.id,
            req.user.id
        );

        return res.json({
            message: RESPONSE_MESSAGES.taskCompleted,
            task,
            stats,
        });
    } catch (error) {
        return next(error);
    }
};

const takeDamageOverdueTask = async (req, res, next) => {
    try {
        const { task, stats } = await applyTaskOverdueDamage(
            req.params.id,
            req.user.id
        );

        return res.json({
            message: RESPONSE_MESSAGES.taskPenalty,
            task,
            stats,
        });
    } catch (error) {
        return next(error);
    }
};

export default {
    getTasks,
    addTask,
    toggleCompleteTask,
    deleteTask,
    completeTask,
    takeDamageOverdueTask,
};
