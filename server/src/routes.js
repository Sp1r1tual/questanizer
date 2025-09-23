import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { authRouter } from "./auth/router/auth-router.js";
import { tasksRouter } from "./tasks/router/tasks-router.js";
import { userStatsRouter } from "./stats/router/user-stats-router.js";
import { bossRouter } from "./boss/router/boss-router.js";
import { userRouter } from "./user/router/user-router.js";
import { friendsRouter } from "./user/router/friends-router.js";
import { supportRouter } from "./support/router/support-router.js";
import { marketRouter } from "./market/router/market-router.js";
import { userInventoryRouter } from "./user/router/user-inventory-router.js";
import { localizationRouter } from "./user/router/localization-router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = (app) => {
  app.use("/public", express.static(path.resolve(__dirname, "../public")));
  app.use("/", supportRouter);
  app.use("/", authRouter);
  app.use("/", localizationRouter);
  app.use("/", userRouter);
  app.use("/", friendsRouter);
  app.use("/", tasksRouter);
  app.use("/", userStatsRouter);
  app.use("/", bossRouter);
  app.use("/", marketRouter);
  app.use("/", userInventoryRouter);
};

export { routes };
