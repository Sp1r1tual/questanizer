import { Router } from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
import validationMiddleware from "../middleware/validation-middleware.js";
import {
    registrationValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from "../validations/auth-validations.js";

const router = new Router();

router.post(
    "/registration",
    registrationValidation,
    validationMiddleware,
    userController.registration
);

router.get("/activate/:link", userController.activate);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validationMiddleware,
    userController.forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPasswordValidation,
    validationMiddleware,
    userController.resetPassword
);

router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

export default router;
