import { body } from "express-validator";

const updateUserProfileValidation = [
    body("username")
        .optional()
        .isLength({ min: 3, max: 32 })
        .withMessage("Username must be between 3 and 32 characters long")
        .matches(/^[a-zA-Z0-9_.-]+$/)
        .withMessage(
            "The name can only contain Latin characters, numbers, dashes, periods, and underscores"
        ),

    body("bio")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Profile description should not exceed 500 characters"),
];

export default updateUserProfileValidation;
