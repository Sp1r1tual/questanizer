import { Router } from "express";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../../shared/middlewares/auth-middleware.js";
import validationErrorsMiddleware from "../../shared/middlewares/validation-errors-middleware.js";
import updateUserProfileValidation from "../utils/validations/profile-validations.js";
import uploadAvatarMiddleware from "../middlewares/upload-avatar-middleware.js";
import validateSearchQueryMiddleware from "../middlewares/validate-search-query-middleware.js";

const router = new Router();

router.get("/user/:id", userController.getUserByIdPublic);

router.use(authMiddleware);

router.get("/profile", userController.getUserProfile);

router.patch(
    "/profile",
    updateUserProfileValidation,
    uploadAvatarMiddleware.single("photo"),
    validationErrorsMiddleware,
    userController.updateUserProfile
);

router.get("/users", userController.getUsers);

router.get(
    "/users/search",
    validateSearchQueryMiddleware,
    userController.searchUsers
);

export default router;
