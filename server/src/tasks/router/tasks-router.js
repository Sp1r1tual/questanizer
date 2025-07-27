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

tasksRouter.use(authMiddleware);

tasksRouter.get("/tasks", getTasks);

tasksRouter.post("/tasks", validateTaskBodyMiddleware, addTask);

tasksRouter.patch(
    "/tasks/:id/complete",
    validateTaskIdMiddleware,
    completeTask
);

tasksRouter.patch(
    "/tasks/:id/overdue",
    validateTaskIdMiddleware,
    takeDamageOverdueTask
);

tasksRouter.delete("/tasks/:id", validateTaskIdMiddleware, deleteTask);

export { tasksRouter };
