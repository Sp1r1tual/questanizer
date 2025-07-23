import { Router } from "express";
import userStatsController from "../controllers/user-stats-controller.js";
import authMiddleware from "../../shared/middlewares/auth-middleware.js";

const router = new Router();

router.use(authMiddleware);

router.get("/stats", userStatsController.getStats);

router.patch("/stats/reset", userStatsController.resetUserStats);

export default router;
