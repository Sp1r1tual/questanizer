import { Router } from "express";
import tasksController from "../controllers/tasks-controller.js";
import tasksMiddleware from "../middlewares/tasks-middleware.js";
import authMiddleware from "../../auth/middlewares/auth-middleware.js";

const router = new Router();

router.get("/tasks", authMiddleware, tasksController.getTasks);

router.post("/tasks", authMiddleware, tasksMiddleware, tasksController.addTask);

router.patch(
    "/tasks/:id/complete",
    authMiddleware,
    tasksController.completeTask
);

router.delete("/tasks/:id", authMiddleware, tasksController.deleteTask);

export default router;
