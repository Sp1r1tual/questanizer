import { Router } from "express";
import userStatsController from "../controllers/user-stats-controller.js";
import authMiddleware from "../../auth/middlewares/auth-middleware.js";

const router = new Router();

router.use(authMiddleware);

router.get("/stats", userStatsController.getStats);

router.patch("/stats/reset", userStatsController.resetStats);

export default router;
