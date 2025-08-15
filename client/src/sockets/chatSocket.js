import { io } from "socket.io-client";

import {
    setStatus,
    setSocketId,
    setError,
} from "../store/chat/chatSocketSlice";

import {
    setMessages,
    setCurrentChatUserName,
    addMessage,
    markAsRead,
    removeMessage,
} from "../store/chat/chatSlice";

import { refreshToken } from "../http/interceptors/authInterceptors";

let socket = null;
let reconnectTimeout = null;
let isRefreshingSocketToken = false;
let hasFailedRefresh = false;

const scheduleReconnect = (dispatch) => {
    clearTimeout(reconnectTimeout);

    reconnectTimeout = setTimeout(() => {
        dispatch(connectChatSocket());
    }, 2000);
};

const reconnectWithNewToken = async (dispatch) => {
    if (hasFailedRefresh) return;

    try {
        isRefreshingSocketToken = true;

        await refreshToken();

        dispatch(connectChatSocket());
    } catch (error) {
        hasFailedRefresh = true;

        dispatch(setStatus("error"));
        dispatch(setError("socket.tokenExpired"));
    } finally {
        isRefreshingSocketToken = false;
    }
};

const connectChatSocket = () => (dispatch, getState) => {
    const { status } = getState().chatSocket;

    if (hasFailedRefresh) return;

    if (status === "connecting" || status === "connected") return;

    dispatch(setStatus("connecting"));

    const token = localStorage.getItem("token");

    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
    }

    socket = io(import.meta.env.VITE_SOCKET_URL, {
        path: "/chat/socket.io",
        auth: { authorization: token ? `Bearer ${token}` : undefined },
        transports: ["websocket"],
        reconnection: false,
    });

    socket.on("connect", () => {
        dispatch(setStatus("connected"));
        dispatch(setSocketId(socket.id));
    });

    socket.on("disconnect", async (reason) => {
        dispatch(setStatus("disconnected"));

        if (reason === "server token expired") {
            return await reconnectWithNewToken(dispatch);
        }

        if (["io server disconnect", "io client disconnect"].includes(reason)) {
            return scheduleReconnect(dispatch);
        }

        if (["transport close", "ping timeout"].includes(reason)) {
            return await reconnectWithNewToken(dispatch);
        }

        scheduleReconnect(dispatch);
    });

    socket.on("connect_error", async (error) => {
        dispatch(setStatus("error"));
        dispatch(setError(error.message));

        if (
            error.message.includes("Unauthorized") &&
            !isRefreshingSocketToken
        ) {
            return await reconnectWithNewToken(dispatch);
        }

        scheduleReconnect(dispatch);
    });

    socket.on("chat_history", ({ withUserName, messages }) => {
        dispatch(setMessages(messages));
        dispatch(setCurrentChatUserName(withUserName));
    });

    socket.on("private_message", (message) => {
        dispatch(addMessage(message));
    });

    socket.on("message_read", ({ messageId, readerId, readAt }) => {
        dispatch(markAsRead({ messageId, readerId, readAt }));
    });

    socket.on("message_deleted", ({ messageId }) => {
        dispatch(removeMessage(messageId));
    });

    socket.on("token_expired", async () => {
        if (!isRefreshingSocketToken) {
            await reconnectWithNewToken(dispatch);
        }
    });
};

const disconnectChatSocket = () => () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
};

const sendPrivateMessage = (to, text, callback) => () => {
    if (!socket?.connected) {
        callback?.(new Error("socket.socketNotConnected"));
        return;
    }
    socket.emit("private_message", { to: to, text }, (res) => {
        if (res?.status === "ok") callback?.(null, res);
        else callback?.(new Error("socket.failedToSendMessage"));
    });
};

const deleteMessage = (messageId, callback) => () => {
    if (!socket) {
        callback?.(new Error("socket.socketNotConnected"));
        return;
    }

    socket.emit("delete_message", { messageId }, (response) => {
        if (response?.status === "ok") {
            callback?.(null, response);
        } else {
            callback?.(new Error("socket.failedToDeleteMessage"));
        }
    });
};

const loadChatHistory = (withUserId, callback) => () => {
    if (!socket || !socket.connected) {
        callback?.(new Error("socket.socketNotConnected"));
        return;
    }

    socket.emit("get_chat_history", { withUserId: withUserId }, (response) => {
        if (response?.status === "ok") {
            callback?.(null, response.messages);
        } else {
            callback?.(new Error("socket.failedToLoadChatHistory"));
        }
    });
};

const sendMessageRead = (messageId, callback) => () => {
    if (!socket) {
        callback?.(new Error("socket.socketNotConnected"));
        return;
    }

    socket.emit("message_read", { messageId }, (response) => {
        if (response?.status === "ok") {
            callback?.(null, response);
        } else {
            callback?.(new Error("socket.failedToMarkAsRead"));
        }
    });
};

const isSocketConnected = () => {
    return socket && socket.connected;
};

const getSocketId = () => {
    return socket ? socket.id : null;
};

export {
    connectChatSocket,
    disconnectChatSocket,
    sendPrivateMessage,
    deleteMessage,
    isSocketConnected,
    getSocketId,
    loadChatHistory,
    sendMessageRead,
};
