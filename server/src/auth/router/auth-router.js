import { Router } from "express";
import authController from "../../auth/controllers/auth-controller.js";
import validationErrorsMiddleware from "../../shared/middlewares/validation-errors-middleware.js";
import {
    registrationValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from "../validations/auth-validations.js";

const router = new Router();

router.post(
    "/registration",
    registrationValidation,
    validationErrorsMiddleware,
    authController.registration
);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/refresh", authController.refresh);

router.get("/activate/:link", authController.activate);

router.post(
    "/forgot-password",
    forgotPasswordValidation,
    validationErrorsMiddleware,
    authController.forgotPassword
);

router.post(
    "/reset-password/:token",
    resetPasswordValidation,
    validationErrorsMiddleware,
    authController.resetPassword
);

export default router;
