import mongoose from "mongoose";
import ApiError from "../../shared/exceptions/api-error.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";

const validateTaskIdMiddleware = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(ApiError.BadRequest(RESPONSE_MESSAGES.invalidTaskId));
    }
    next();
};

export default validateTaskIdMiddleware;
