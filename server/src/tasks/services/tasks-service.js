import TaskModel from "../models/tasks-model.js";
import ApiError from "../../shared/exceptions/api-error.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";

const getAllTasks = (userId) => {
    return TaskModel.find({ user: userId });
};

const createTask = ({ text, deadline, difficulty, userId }) => {
    return new TaskModel({ text, deadline, difficulty, user: userId }).save();
};

const toggleCompleteTask = async (id, userId) => {
    const task = await TaskModel.findOne({ _id: id, user: userId });

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);

    task.isCompleted = !task.isCompleted;
    return task.save();
};

const deleteTaskById = async (id, userId) => {
    const task = await TaskModel.findOneAndDelete({ _id: id, user: userId });

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
};

export { getAllTasks, createTask, toggleCompleteTask, deleteTaskById };
