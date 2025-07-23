import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import ensureUploadDirs from "./auth/utils/ensureUploadDirs.js";
import authRouter from "./auth/router/auth-router.js";
import tasksRouter from "./tasks/router/tasks-router.js";
import userStatsRouter from "./stats/router/user-stats-router.js";
import bossRouter from "./boss/router/boss-router.js";
import errorMiddleware from "./shared/middlewares/error-middleware.js";

const PORT = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ensureUploadDirs();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use("/api", authRouter);
app.use("/api/public", express.static(path.resolve(__dirname, "../public")));
app.use("/api", tasksRouter);
app.use("/api", userStatsRouter);
app.use("/api", bossRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {});
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();
