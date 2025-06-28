import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = new Router();

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 8, max: 32 }),
    userController.registration
);

router.get("/activate/:link", userController.activate);

router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.post(
    "/forgot-password",
    body("email").isEmail().withMessage("Please provide a valid email"),
    userController.forgotPassword
);
router.post(
    "/reset-password/:token",
    body("password")
        .isLength({ min: 8, max: 32 })
        .withMessage("Password must be between 8 and 32 characters"),
    userController.resetPassword
);

router.get("/refresh", userController.refresh);

router.get("/users", authMiddleware, userController.getUsers);

export default router;
