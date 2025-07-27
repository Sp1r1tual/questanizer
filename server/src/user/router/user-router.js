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

userRouter.get("/user/:id", getUserByIdPublic);

userRouter.use(authMiddleware);

userRouter.get("/profile", getUserProfile);

userRouter.patch(
    "/profile",
    updateUserProfileValidation,
    uploadAvatarMiddleware.single("photo"),
    validationErrorsMiddleware,
    updateUserProfile
);

userRouter.get("/users", getUsers);

userRouter.get("/users/search", validateSearchQueryMiddleware, searchUsers);

export { userRouter };
