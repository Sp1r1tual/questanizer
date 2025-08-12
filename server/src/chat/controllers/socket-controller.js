import { chatService } from "../services/chat-service.js";

const clients = new Map();

const socketController = (io) => {
    io.on("connection", (socket) => {
        const userId = String(socket.request.user.id);

        clients.set(userId, socket);

        socket.on("private_message", async ({ to, text }, callback) => {
            try {
                const savedMessage = await chatService.saveMessage({
                    from: userId,
                    to,
                    text,
                });

                const receiverSocket = clients.get(String(to));

                if (receiverSocket) {
                    receiverSocket.emit("private_message", {
                        from: userId,
                        text,
                        createdAt: savedMessage.createdAt,
                    });
                }

                if (callback) callback({ status: "ok" });
            } catch (error) {
                if (callback)
                    callback({ status: "error", message: error.message });
            }
        });

        socket.on("message_read", async ({ messageId }, callback) => {
            try {
                const updatedMessage = await chatService.markMessageAsRead(
                    messageId
                );

                if (!updatedMessage) {
                    if (callback)
                        return callback({
                            status: "error",
                            message: "Message not found",
                        });
                    return;
                }

                const senderId = updatedMessage.from;
                const readerId = socket.request.user.id;

                const senderSocket = clients.get(senderId);

                if (senderSocket) {
                    senderSocket.emit("message_read", {
                        messageId,
                        readerId,
                        readAt: updatedMessage.readAt,
                    });
                }

                if (callback) callback({ status: "ok" });
            } catch (error) {
                if (callback)
                    callback({ status: "error", message: error.message });
            }
        });

        socket.on("delete_message", async ({ messageId }, callback) => {
            try {
                const message = await chatService.getMessageById(messageId);

                if (!message) {
                    if (callback)
                        return callback({
                            status: "error",
                            message: "Message not found",
                        });
                    return;
                }

                await chatService.deleteMessage(messageId);

                const senderSocket = clients.get(String(message.from));
                const receiverSocket = clients.get(String(message.to));

                const deletePayload = { messageId };

                if (senderSocket)
                    senderSocket.emit("message_deleted", deletePayload);

                if (receiverSocket)
                    receiverSocket.emit("message_deleted", deletePayload);

                if (callback) callback({ status: "ok" });
            } catch (error) {
                if (callback)
                    callback({ status: "error", message: error.message });
            }
        });

        socket.on("disconnect", () => {
            clients.delete(userId);
        });
    });
};

export { socketController };
