import { ApiError } from "../exceptions/api-error.js";

const socketErrorMiddleware = (handler) => {
    return async (...args) => {
        let callback = null;
        const lastArg = args[args.length - 1];

        if (typeof lastArg === "function") {
            callback = lastArg;
        }

        try {
            await handler(...args);
        } catch (error) {
            console.error("Socket error:", err);

            if (!callback) {
                return;
            }

            if (error instanceof ApiError) {
                return callback({
                    status: "error",
                    message: error.message,
                    errors: error.errors,
                });
            }

            return callback({
                status: "error",
                message: error.message || "Something went wrong",
            });
        }
    };
};

export { socketErrorMiddleware };
