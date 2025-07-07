import { Router } from "express";
import tasksController from "../controllers/tasks-controller.js";
import validateTaskBodyMiddleware from "../middlewares/validate-task-body-middleware.js";
import validateTaskIdMiddleware from "../middlewares/validate-task-id-middleware.js";
import authMiddleware from "../../auth/middlewares/auth-middleware.js";

const router = new Router();

router.use(authMiddleware);

router.get("/tasks", tasksController.getTasks);

router.post("/tasks", validateTaskBodyMiddleware, tasksController.addTask);

router.patch(
    "/tasks/:id/complete",
    validateTaskIdMiddleware,
    tasksController.completeTask
);

router.patch(
    "/tasks/:id/overdue",
    validateTaskIdMiddleware,
    tasksController.takeDamageOverdueTask
);

router.delete(
    "/tasks/:id",
    validateTaskIdMiddleware,
    tasksController.deleteTask
);

export default router;
