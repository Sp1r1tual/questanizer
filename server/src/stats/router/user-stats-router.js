import { Router } from "express";
import {
    getStats,
    resetUserStats,
} from "../controllers/user-stats-controller.js";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const userStatsRouter = new Router();

userStatsRouter.use(authMiddleware);

userStatsRouter.get("/stats", getStats);

userStatsRouter.patch("/stats/reset", resetUserStats);

export { userStatsRouter };
