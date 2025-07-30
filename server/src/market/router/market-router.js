import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";
import {
    getAllMarkets,
    getUserCart,
    addToCart,
    removeFromCart,
    checkoutCart,
} from "../controllers/market-controller.js";

const marketRouter = new Router();

marketRouter.get("/market", authMiddleware, getAllMarkets);

marketRouter.get("/cart", authMiddleware, getUserCart);

marketRouter.post("/cart", authMiddleware, addToCart);

marketRouter.patch("/cart", authMiddleware, checkoutCart);

marketRouter.delete("/cart/:equipmentId", authMiddleware, removeFromCart);

export { marketRouter };
