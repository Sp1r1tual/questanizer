import ApiError from "../../shared/exceptions/api-error.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";

const tasksMiddleware = (req, res, next) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
        return next(ApiError.BadRequest(RESPONSE_MESSAGES.textRequired));
    }

    next();
};

export default tasksMiddleware;
