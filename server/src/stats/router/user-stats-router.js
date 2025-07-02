import { Router } from "express";
import userStatsController from "../controllers/user-stats-controller.js";
import authMiddleware from "../../auth/middlewares/auth-middleware.js";
import statsMiddleware from "../middlewares/stats-middleware.js";

const router = new Router();

router.use(authMiddleware);

router.get("/stats", userStatsController.getStats);

router.patch(
    "/stats/gain-experience",
    statsMiddleware,
    userStatsController.gainExperience
);

router.patch(
    "/stats/take-damage",
    statsMiddleware,
    userStatsController.takeDamage
);

router.patch("/stats/reset", userStatsController.resetStats);

export default router;
