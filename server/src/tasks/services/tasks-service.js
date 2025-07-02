import TaskModel from "../models/tasks-model.js";
import ApiError from "../../shared/exceptions/api-error.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";

const getAllTasks = () => TaskModel.find();

const createTask = ({ text, deadline, difficulty }) => {
    return new TaskModel({ text, deadline, difficulty }).save();
};

const toggleCompleteTask = async (id) => {
    const task = await TaskModel.findById(id);

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);

    task.isCompleted = !task.isCompleted;
    return task.save();
};

const deleteTaskById = async (id) => {
    const task = await TaskModel.findByIdAndDelete(id);

    if (!task) throw ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound);
};

export { getAllTasks, createTask, toggleCompleteTask, deleteTaskById };
