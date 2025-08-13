import { Server } from "socket.io";

import { authMiddleware } from "../shared/middlewares/auth-middleware.js";

import { socketController } from "./controllers/socket-controller.js";

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

            if (!req.user) return next(new Error("Unauthorized"));

            next();
        });
    });

    socketController(io);

    return io;
};

export { initChatSocket };
