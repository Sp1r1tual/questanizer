import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRouter from "./auth/router/auth-router.js";
import tasksRouter from "./tasks/router/tasks-router.js";
import userStatsRouter from "./stats/router/user-stats-router.js";
import bossRouter from "./boss/router/boss-router.js";
import userRouter from "./user/router/user-router.js";
import friendsRouter from "./user/router/friends-router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = (app) => {
    app.use(
        "/api/public",
        express.static(path.resolve(__dirname, "../public"))
    );
    app.use("/api", authRouter);
    app.use("/api", userRouter);
    app.use("/api", friendsRouter);
    app.use("/api", tasksRouter);
    app.use("/api", userStatsRouter);
    app.use("/api", bossRouter);
};

export default routes;
