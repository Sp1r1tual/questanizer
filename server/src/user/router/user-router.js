import { Router } from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../../shared/middlewares/auth-middleware.js";
import validationErrorsMiddleware from "../../shared/middlewares/validation-errors-middleware.js";
import updateUserProfileValidation from "../utils/validations/profile-validations.js";
import uploadAvatarMiddleware from "../middlewares/upload-avatar-middleware.js";

const router = new Router();

router.get("/profile", authMiddleware, userController.getUserProfile);

router.patch(
    "/profile",
    authMiddleware,
    updateUserProfileValidation,
    uploadAvatarMiddleware.single("photo"),
    validationErrorsMiddleware,
    userController.updateUserProfile
);

router.get("/users", authMiddleware, userController.getUsers);

router.get("/user/:id", authMiddleware, userController.getUserByIdPublic);

export default router;
