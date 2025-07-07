import ApiError from "../../shared/exceptions/api-error.js";

const validateTaskBodyMiddleware = (req, res, next) => {
    const { text, difficulty } = req.body;

    if (!text?.trim()) {
        return next(ApiError.BadRequest("Task text is required"));
    }

    if (!difficulty) {
        return next(ApiError.BadRequest("Difficulty is required"));
    }

    next();
};

export default validateTaskBodyMiddleware;
