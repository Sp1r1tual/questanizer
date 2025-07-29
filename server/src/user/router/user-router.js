import { Router } from "express";
import {
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserByIdPublic,
    searchUsers,
} from "../controllers/user-controller.js";
import { authMiddleware } from "../../shared/middlewares/auth-middleware.js";
import { validationErrorsMiddleware } from "../../shared/middlewares/validation-errors-middleware.js";
import { updateUserProfileValidation } from "../utils/validations/profile-validations.js";
import { uploadAvatarMiddleware } from "../middlewares/upload-avatar-middleware.js";
import { validateSearchQueryMiddleware } from "../middlewares/validate-search-query-middleware.js";

const userRouter = new Router();

userRouter.get("/user/:id", authMiddleware, getUserByIdPublic);

userRouter.get("/profile", authMiddleware, getUserProfile);

userRouter.patch(
    "/profile",
    authMiddleware,
    uploadAvatarMiddleware,
    updateUserProfileValidation,
    validationErrorsMiddleware,
    updateUserProfile
);

userRouter.get("/users", authMiddleware, getUsers);

userRouter.get(
    "/users/search",
    authMiddleware,
    validateSearchQueryMiddleware,
    searchUsers
);

export { userRouter };
