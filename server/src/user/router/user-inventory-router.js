import { Router } from "express";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";
import {
    getUserInventory,
    useUserInventoryItem,
} from "../controllers/user-inventory-controller.js";

const userInventoryRouter = new Router();

userInventoryRouter.get("/inventory", authMiddleware, getUserInventory);

userInventoryRouter.patch(
    "/inventory/use/:itemId",
    authMiddleware,
    useUserInventoryItem
);

export { userInventoryRouter };
