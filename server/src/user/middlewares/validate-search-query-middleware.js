import { ApiError } from "../../shared/exceptions/api-error.js";

const validateSearchQueryMiddleware = (req, res, next) => {
    try {
        const { query, page, limit } = req.query;

        if (!query?.trim()) {
            throw ApiError.BadRequest("The 'query' parameter cannot be empty");
        }

        if (page && (isNaN(page) || parseInt(page) < 1)) {
            throw ApiError.BadRequest(
                "The 'page' parameter must be a positive number"
            );
        }

        if (
            limit &&
            (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)
        ) {
            throw ApiError.BadRequest(
                "The 'limit' parameter must be between 1 and 100"
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};

export { validateSearchQueryMiddleware };
