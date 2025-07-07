import mongoose from "mongoose";
import ApiError from "../../shared/exceptions/api-error.js";

const validateTaskIdMiddleware = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(ApiError.BadRequest("Invalid task ID"));
    }
    next();
};

export default validateTaskIdMiddleware;
