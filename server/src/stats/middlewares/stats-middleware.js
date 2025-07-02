import ApiError from "../../shared/exceptions/api-error.js";

const statsMiddleware = (req, res, next) => {
    const { amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
        return next(ApiError.BadRequest("Invalid amount"));
    }

    next();
};

export default statsMiddleware;
