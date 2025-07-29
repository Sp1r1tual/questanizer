import { Router } from "express";
import {
    getStats,
    resetUserStats,
} from "../controllers/user-stats-controller.js";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const userStatsRouter = new Router();

userStatsRouter.get("/stats", authMiddleware, getStats);

userStatsRouter.patch("/stats/reset", authMiddleware, resetUserStats);

export { userStatsRouter };
