import {
    getAllTasks,
    createTask,
    toggleCompleteTask,
    deleteTaskById,
} from "../services/tasks-service.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";

const getTasks = async (req, res, next) => {
    try {
        const tasks = await getAllTasks();

        return res.json(tasks);
    } catch (error) {
        return next(error);
    }
};

const addTask = async (req, res, next) => {
    try {
        const { text, deadline, difficulty } = req.body;
        const task = await createTask({ text, deadline, difficulty });

        return res.status(201).json(task);
    } catch (error) {
        return next(error);
    }
};

const completeTask = async (req, res, next) => {
    try {
        const task = await toggleCompleteTask(req.params.id);

        return res.json(task);
    } catch (error) {
        return next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        await deleteTaskById(req.params.id);
        return res.json({ message: RESPONSE_MESSAGES.taskDeleted });
    } catch (error) {
        return next(error);
    }
};

export default {
    getTasks,
    addTask,
    completeTask,
    deleteTask,
};
