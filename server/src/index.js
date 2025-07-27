import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { ensureUploadDirs } from "./user/utils/uploads/ensureUploadDirs.js";
import { routes } from "./routes.js";
import { middlewares } from "./middlewares.js";
import { errorMiddleware } from "./shared/middlewares/error-middleware.js";

const PORT = process.env.PORT || 5000;
const app = express();

ensureUploadDirs();

middlewares(app);
routes(app);

app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

start();
