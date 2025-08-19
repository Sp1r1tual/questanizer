import { tasksService } from "../services/tasks-service.js";

const getTasks = async (req, res, next) => {
  try {
    const tasks = await tasksService.getAllTasks(req.user.id);

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const addTask = async (req, res, next) => {
  try {
    const task = await tasksService.createTask(req.body, req.user.id);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const result = await tasksService.completeTask(req.params.id, req.user.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await tasksService.removeTask(req.params.id, req.user.id);
    res.json();
  } catch (error) {
    next(error);
  }
};

const takeDamageOverdueTask = async (req, res, next) => {
  try {
    const result = await tasksService.applyOverduePenalty(req.params.id, req.user.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export { getTasks, addTask, completeTask, deleteTask, takeDamageOverdueTask };
