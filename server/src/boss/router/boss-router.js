import { Router } from "express";
import bossController from "../controllers/boss-controller.js";
import authMiddleware from "../../auth/middlewares/auth-middleware.js";
import bossMiddleware from "../middlewares/boss-middleware.js";

const router = new Router();

router.use(authMiddleware);

router.get("/boss", bossMiddleware, bossController.getBoss);

router.post("/boss/spawn", bossController.spawnBoss);

router.patch("/boss/reset", bossController.resetBoss);

router.patch("/boss/damage", bossController.damageBoss);

router.patch("/boss/rage", bossController.rageBoss);

router.patch("/boss/rage/mark", bossController.markTaskAsRaged);

router.patch("/boss/reward", bossController.rewardUser);

export default router;
