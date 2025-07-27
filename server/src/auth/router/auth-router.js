import { Router } from "express";
import {
    registration,
    login,
    logout,
    refresh,
    activate,
    forgotPassword,
    resetPassword,
} from "../../auth/controllers/auth-controller.js";
import { validationErrorsMiddleware } from "../../shared/middlewares/validation-errors-middleware.js";
import {
    registrationValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from "../validations/auth-validations.js";

const authRouter = new Router();

authRouter.post(
    "/registration",
    registrationValidation,
    validationErrorsMiddleware,
    registration
);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/refresh", refresh);

authRouter.get("/activate/:link", activate);

authRouter.post(
    "/forgot-password",
    forgotPasswordValidation,
    validationErrorsMiddleware,
    forgotPassword
);

authRouter.post(
    "/reset-password/:token",
    resetPasswordValidation,
    validationErrorsMiddleware,
    resetPassword
);

export { authRouter };
