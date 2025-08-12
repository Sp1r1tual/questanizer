import { Router } from "express";

import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

import { getChatHistoryController } from "../controllers/chat-controller.js";

const chatRouter = Router();

chatRouter.get("/chat/:withUserId", authMiddleware, getChatHistoryController);

export { chatRouter };
