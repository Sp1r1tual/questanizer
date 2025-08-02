import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";
import {
    getMarketItems,
    getUserCart,
    addToCart,
    removeFromCart,
    checkoutCart,
} from "../controllers/market-controller.js";

const marketRouter = new Router();

marketRouter.get("/market", authMiddleware, getMarketItems);

marketRouter.get("/cart", authMiddleware, getUserCart);

marketRouter.patch("/cart/add", authMiddleware, addToCart);

marketRouter.post("/cart/checkout", authMiddleware, checkoutCart);

marketRouter.patch("/cart/remove/:itemId", authMiddleware, removeFromCart);

export { marketRouter };
