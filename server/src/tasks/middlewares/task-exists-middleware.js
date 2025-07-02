import { deleteTaskById } from "../services/tasks-service.js";
import RESPONSE_MESSAGES from "../../shared/utils/response-messages.js";
import ApiError from "../../shared/exceptions/api-error.js";

const taskExistsMiddleware = async (req, res, next) => {
    try {
        const task = await deleteTaskById(req.params.id);

        if (!task) {
            return next(ApiError.BadRequest(RESPONSE_MESSAGES.taskNotFound));
        }

        req.task = task;
        next();
    } catch (error) {
        next(ApiError.BadRequest(RESPONSE_MESSAGES.serverError));
    }
};

export default taskExistsMiddleware;
