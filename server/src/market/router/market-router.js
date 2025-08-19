import { Router } from "express";

import {
  getMarketItems,
  getUserCart,
  addToCart,
  syncCart,
  checkoutCart,
} from "../controllers/market-controller.js";

import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const marketRouter = new Router();

marketRouter.get("/market", authMiddleware, getMarketItems);

marketRouter.get("/cart", authMiddleware, getUserCart);

marketRouter.patch("/cart/add", authMiddleware, addToCart);

marketRouter.post("/cart/checkout", authMiddleware, checkoutCart);

marketRouter.post("/cart/sync", authMiddleware, syncCart);

export { marketRouter };
