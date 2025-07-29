import { Router } from "express";
import {
    getTasks,
    addTask,
    completeTask,
    deleteTask,
    takeDamageOverdueTask,
} from "../controllers/tasks-controller.js";
import { validateTaskBodyMiddleware } from "../middlewares/validate-task-body-middleware.js";
import { validateTaskIdMiddleware } from "../middlewares/validate-task-id-middleware.js";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const tasksRouter = new Router();

tasksRouter.get("/tasks", authMiddleware, getTasks);

tasksRouter.post("/tasks", authMiddleware, validateTaskBodyMiddleware, addTask);

tasksRouter.patch(
    "/tasks/:id/complete",
    authMiddleware,
    validateTaskIdMiddleware,
    completeTask
);

tasksRouter.patch(
    "/tasks/:id/overdue",
    authMiddleware,
    validateTaskIdMiddleware,
    takeDamageOverdueTask
);

tasksRouter.delete(
    "/tasks/:id",
    authMiddleware,
    validateTaskIdMiddleware,
    deleteTask
);

export { tasksRouter };
