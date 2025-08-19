import { Router } from "express";

import {
  getUserInventory,
  useUserInventoryItem,
} from "../controllers/user-inventory-controller.js";

import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";

const userInventoryRouter = new Router();

userInventoryRouter.get("/inventory", authMiddleware, getUserInventory);

userInventoryRouter.patch("/inventory/use/:itemId", authMiddleware, useUserInventoryItem);

export { userInventoryRouter };
