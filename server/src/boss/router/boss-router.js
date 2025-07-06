import express from "express";
import bossController from "../controllers/boss-controller.js";
import bossMiddleware from "../middlewares/boss-middleware.js";
import authMiddleware from "../../auth/middlewares/auth-middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/boss", bossMiddleware, bossController.getBoss);

router.post("/boss/spawn", bossMiddleware, bossController.spawnBoss);

router.post("/boss/reset", bossController.resetBoss);

export default router;
