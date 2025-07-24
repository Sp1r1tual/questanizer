import { Router } from "express";
import FriendsController from "../controllers/friends-controller.js";
import authMiddleware from "../../shared/middlewares/auth-middleware.js";

const router = new Router();

router.use(authMiddleware);

router.get("/friends", FriendsController.getFriends);

router.get("/friends/requests", FriendsController.getFriendRequests);

router.post("/friends/request", FriendsController.sendRequest);

router.post("/friends/accept", FriendsController.acceptRequest);

router.post("/friends/remove", FriendsController.removeFriendOrCancel);

export default router;
