import { body, param } from "express-validator";

const ERROR_MESSAGES = {
    fillAllFields: "Please fill out all fields.",
    invalidEmail: "Invalid email format.",
    invalidPassword:
        "Password must be 8-32 characters, include an uppercase letter, and be in Latin",
};

const registrationValidation = [
    body("email").isEmail().withMessage(ERROR_MESSAGES.invalidEmail),
    body("password")
        .isLength({ min: 8, max: 32 })
        .withMessage(ERROR_MESSAGES.invalidPassword),
    body("password")
        .matches(/[A-Z]/)
        .withMessage(ERROR_MESSAGES.invalidPassword),
    body("password")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=]+$/)
        .withMessage(ERROR_MESSAGES.invalidPassword),
];

const forgotPasswordValidation = [
    body("email").isEmail().withMessage(ERROR_MESSAGES.invalidEmail),
];

const resetPasswordValidation = [
    param("token").notEmpty().withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 8, max: 32 })
        .withMessage(ERROR_MESSAGES.invalidPassword),
    body("password")
        .matches(/[A-Z]/)
        .withMessage(ERROR_MESSAGES.invalidPassword),
    body("password")
        .matches(/^[A-Za-z0-9!@#$%^&*()_+\-=]+$/)
        .withMessage(ERROR_MESSAGES.invalidPassword),
];

export {
    ERROR_MESSAGES,
    registrationValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
};
