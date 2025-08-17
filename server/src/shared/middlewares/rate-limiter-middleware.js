import rateLimit from "express-rate-limit";

import { ApiError } from "../exceptions/api-error.js";

const rateLimiterMiddleware = (maxRequests) => {
    return rateLimit({
        windowMs: 60 * 1000,
        max: maxRequests,
        handler: (req, res) => {
            throw ApiError.BadRequest("You are sending too many requests");
        },
    });
};

export { rateLimiterMiddleware };
