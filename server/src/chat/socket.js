import { Server } from "socket.io";

import { authMiddleware } from "../shared/middlewares/auth-middleware.js";
import { ApiError } from "../shared/exceptions/api-error.js";

import { socketController } from "./controllers/socket-controller.js";

import { tokenService } from "../auth/services/token-service.js";

const initChatSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
        path: "/chat/socket.io",
    });

    io.use((socket, next) => {
        const req = socket.request;

        req.headers.authorization =
            socket.handshake.auth?.authorization ||
            socket.handshake.headers?.authorization;

        authMiddleware(req, null, (err) => {
            if (err) return next(err);

            if (!req.user) return next(ApiError.UnauthorizedError());

            try {
                const token = req.headers.authorization?.split(" ")[1] || null;

                if (!token) return next(ApiError.UnauthorizedError());

                const payload = tokenService.validateAccessToken(token);

                if (!payload?.exp) return next(ApiError.UnauthorizedError());

                const msToExpire = payload.exp * 1000 - Date.now();

                if (msToExpire > 0) {
                    setTimeout(() => {
                        socket.emit("token_expired");
                        socket.disconnect(true);
                    }, msToExpire);
                }
            } catch {
                return next(ApiError.UnauthorizedError());
            }

            next();
        });
    });

    socketController(io);

    return io;
};

export { initChatSocket };
