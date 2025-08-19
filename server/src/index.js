import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { routes } from "./routes.js";
import { initChatSocket } from "./chat/socket.js";

import { middlewares } from "./middlewares.js";
import { errorMiddleware } from "./shared/middlewares/error-middleware.js";

import { supportService } from "./support/services/support-service.js";
import { marketService } from "./market/services/market-service.js";

import { ensureUploadDirs } from "./user/utils/uploads/ensureUploadDirs.js";

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

dotenv.config();
ensureUploadDirs();
middlewares(app);
routes(app);
app.use(errorMiddleware);

initChatSocket(server);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    await supportService.initializeFaqCollection();
    await marketService.initializeMarketCollection();

    server.listen(PORT, () => {
      console.log(`Server started on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
