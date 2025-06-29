import { validationResult } from "express-validator";
import { body, param } from "express-validator";
import ApiError from "../exceptions/api-error.js";

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
    }
    next();
};

const forgotPasswordValidation = [
    body("email").notEmpty().withMessage("Email is required"),
];

const resetPasswordValidation = [
    param("token").notEmpty().withMessage("Reset token is required"),
    body("password").notEmpty().withMessage("Password is required"),
];

export {
    validationMiddleware,
    forgotPasswordValidation,
    resetPasswordValidation,
};
