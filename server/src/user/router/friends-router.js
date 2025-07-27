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

friendsRouter.use(authMiddleware);

friendsRouter.get("/friends", getFriends);

friendsRouter.get("/friends/requests", getFriendRequests);

friendsRouter.post("/friends/request", sendRequest);

friendsRouter.post("/friends/accept", acceptRequest);

friendsRouter.post("/friends/remove", removeFriendOrCancel);

export { friendsRouter };
