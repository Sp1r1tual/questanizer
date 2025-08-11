import { Router } from "express";

import {
    getFriends,
    getFriendRequests,
    sendRequest,
    acceptRequest,
    removeFriendOrCancel,
} from "../controllers/friends-controller.js";

import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const friendsRouter = new Router();

friendsRouter.get("/friends", authMiddleware, getFriends);

friendsRouter.get("/friends/requests", authMiddleware, getFriendRequests);

friendsRouter.post("/friends/request", authMiddleware, sendRequest);

friendsRouter.post("/friends/accept", authMiddleware, acceptRequest);

friendsRouter.post("/friends/remove", authMiddleware, removeFriendOrCancel);

export { friendsRouter };
