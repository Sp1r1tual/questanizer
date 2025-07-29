import express from "express";
import {
    getBossController,
    spawnBossController,
} from "../controllers/boss-controller.js";
import { bossMiddleware } from "../middlewares/boss-middleware.js";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const bossRouter = express.Router();

bossRouter.get("/boss", authMiddleware, bossMiddleware, getBossController);

bossRouter.post(
    "/boss/spawn",
    authMiddleware,
    bossMiddleware,
    spawnBossController
);

export { bossRouter };
