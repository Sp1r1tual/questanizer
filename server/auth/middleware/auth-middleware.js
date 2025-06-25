import ApiError from "../exceptions/api-error.js";
import tokenService from "../services/token-service.js";

const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accesToken = authorizationHeader.split(" ")[1];

        if (!accesToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccesToken(accesToken);

        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;

        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
};

export default authMiddleware;
