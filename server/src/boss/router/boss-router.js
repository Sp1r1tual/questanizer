import express from "express";
import bossController from "../controllers/boss-controller.js";
import bossMiddleware from "../middlewares/boss-middleware.js";
import authMiddleware from "../../shared/middlewares/auth-middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/boss", bossMiddleware, bossController.getBoss);

router.post("/boss/spawn", bossMiddleware, bossController.spawnBoss);

export default router;
