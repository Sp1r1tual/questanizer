import { Router } from "express";
import tasksController from "../controllers/tasks-controller.js";
import tasksMiddleware from "../middlewares/tasks-middleware.js";

const router = new Router();

router.get("/tasks", tasksController.getTasks);

router.post("/tasks", tasksMiddleware, tasksController.addTask);

router.patch("/tasks/:id/complete", tasksController.completeTask);

router.delete("/tasks/:id", tasksController.deleteTask);

export default router;
