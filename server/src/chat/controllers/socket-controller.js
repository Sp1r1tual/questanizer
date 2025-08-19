import { socketErrorMiddleware } from "../../shared/middlewares/socket-error-middleware.js";

import { ApiError } from "../../shared/exceptions/api-error.js";

import { chatService } from "../services/chat-service.js";

import { getUserName } from "../utils/get-user-name.js";
import { formatMessage } from "../utils/format-message.js";

const socketController = (io) => {
  io.on("connection", (socket) => {
    const userId = String(socket.request.user.id);

    chatService.addClient(userId, socket);

    socket.on(
      "get_chat_history",
      socketErrorMiddleware(async ({ withUserId }, callback) => {
        const history = await chatService.getChatHistory(userId, withUserId);
        const userName = await getUserName(withUserId);

        const historyPayload = history.map((msg) => formatMessage(msg, userName));

        socket.emit("chat_history", {
          withUserId,
          withUserName: userName,
          messages: historyPayload,
        });

        callback?.({
          status: "ok",
          messages: historyPayload,
        });
      }),
    );

    socket.on(
      "private_message",
      socketErrorMiddleware(async ({ to, text }, callback) => {
        if (!text) throw ApiError.BadRequest("Message text is required");

        const savedMessage = await chatService.saveMessage({
          from: userId,
          to,
          text,
        });
        const senderName = await getUserName(userId);
        const messagePayload = formatMessage(savedMessage, senderName);

        socket.emit("private_message", messagePayload);

        const receiverSocket = chatService.getClient(String(to));

        if (receiverSocket) {
          receiverSocket.emit("private_message", messagePayload);
        }

        callback?.({
          status: "ok",
          message: messagePayload,
        });
      }),
    );

    socket.on(
      "message_read",
      socketErrorMiddleware(async ({ messageId }, callback) => {
        const updatedMessage = await chatService.markMessageAsRead(messageId, userId);

        if (!updatedMessage) throw ApiError.NotFound("Message not found");

        const senderSocket = chatService.getClient(String(updatedMessage.from));

        if (senderSocket) {
          senderSocket.emit("message_read", {
            messageId,
            readerId: userId,
            readAt: updatedMessage.readAt,
          });
        }

        callback?.({ status: "ok" });
      }),
    );

    socket.on(
      "delete_message",
      socketErrorMiddleware(async ({ messageId }, callback) => {
        const message = await chatService.getMessageById(messageId);

        if (!message) throw ApiError.NotFound("Message not found");

        if (String(message.from) !== userId) throw ApiError.Forbidden();

        await chatService.deleteMessage(messageId);

        [message.from, message.to].forEach((id) => {
          const clientSocket = chatService.getClient(String(id));

          if (clientSocket) {
            clientSocket.emit("message_deleted", { messageId });
          }
        });

        callback?.({ status: "ok" });
      }),
    );

    socket.on("disconnect", () => {
      chatService.removeClient(userId);
    });
  });
};

export { socketController };
