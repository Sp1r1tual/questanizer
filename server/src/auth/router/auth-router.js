import { Router } from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import validationMiddleware from "../middlewares/validation-middleware.js";
import uploadAvatarMiddleware from "../middlewares/upload-middleware.js";
import {
    registrationValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from "../validations/auth-validations.js";
import updateUserProfileValidation from "../validations/profile-validations.js";

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

router.get("/profile", authMiddleware, userController.getUserProfile);

router.patch(
    "/profile",
    authMiddleware,
    updateUserProfileValidation,
    uploadAvatarMiddleware.single("photo"),
    validationMiddleware,
    userController.updateUserProfile
);

router.get("/users", authMiddleware, userController.getUsers);

router.get("/user/:id", authMiddleware, userController.getUserByIdPublic);

export default router;
