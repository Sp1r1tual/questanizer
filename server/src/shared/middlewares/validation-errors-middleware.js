import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

const validationErrorsMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
    }
    next();
};

export default validationErrorsMiddleware;
