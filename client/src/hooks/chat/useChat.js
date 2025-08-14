import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentChatUserId, clearMessages } from "@/store/chat/chatSlice";

import {
    connectChatSocket,
    sendPrivateMessage,
    loadChatHistory,
    isSocketConnected,
    sendMessageRead,
    deleteMessage,
} from "@/sockets/chatSocket";

const useChat = (userId, isOpen) => {
    const dispatch = useDispatch();

    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastLoadedUserId, setLastLoadedUserId] = useState(null);

    const currentUserId = useSelector((state) => state.auth.user.id);
    const messages = useSelector((state) => state.chat.messages);
    const currentChatUserId = useSelector(
        (state) => state.chat.currentChatUserId
    );
    const currentChatUserName = useSelector(
        (state) => state.chat.currentChatUserName
    );

    const socketStatus = useSelector((state) => state.chatSocket.status);
    const socketError = useSelector((state) => state.chatSocket.error);

    const lastProcessedMessages = useRef([]);
    const cancelCheck = useRef(false);

    useEffect(() => {
        if (isOpen && userId) {
            dispatch(setCurrentChatUserId(userId));
            dispatch(connectChatSocket());

            cancelCheck.current = false;

            if (lastLoadedUserId !== userId) {
                handleLoadHistory();
            }
        }
        return () => {
            if (!isOpen) setError(null);
        };
    }, [isOpen, userId, lastLoadedUserId, dispatch]);

    useEffect(() => {
        if (socketStatus === "error" && socketError) {
            setIsLoading(false);
            setError(socketError);

            cancelCheck.current = true;
        }
    }, [socketStatus, socketError]);

    useEffect(() => {
        if (isOpen && messages.length > 0 && isSocketConnected()) {
            const unreadFromCurrentUser = messages.filter(
                (msg) =>
                    msg.to === currentUserId && !msg.read && msg.from === userId
            );

            const currentIds = unreadFromCurrentUser.map((m) => m.id);

            const newIds = currentIds.filter(
                (id) => !lastProcessedMessages.current.includes(id)
            );

            if (newIds.length > 0) {
                lastProcessedMessages.current = [
                    ...lastProcessedMessages.current,
                    ...newIds,
                ];

                const newMessages = unreadFromCurrentUser.filter((msg) =>
                    newIds.includes(msg.id)
                );

                newMessages.forEach((msg) => {
                    dispatch(sendMessageRead(msg.id));
                });
            }
        }
    }, [messages, isOpen, currentUserId, userId, dispatch]);

    const handleLoadHistory = () => {
        setIsLoading(true);
        setError(null);

        dispatch(clearMessages());

        lastProcessedMessages.current = [];
        cancelCheck.current = false;

        let attempts = 0;
        const maxAttempts = 20;

        const checkConnection = () => {
            if (cancelCheck.current) return;

            attempts++;
            if (attempts > maxAttempts) {
                setIsLoading(false);
                setError("socket.connectionTimeout");
                return;
            }

            if (!isSocketConnected()) {
                setTimeout(checkConnection, 500);
                return;
            }

            dispatch(
                loadChatHistory(userId, (error) => {
                    setIsLoading(false);

                    if (error) {
                        setError(error.message);
                        return;
                    }

                    setLastLoadedUserId(userId);
                })
            );
        };
        setTimeout(checkConnection, 100);
    };

    const handleSend = () => {
        if (!text.trim()) return;

        const msgText = text.trim();

        setText("");

        dispatch(
            sendPrivateMessage(userId, msgText, (error) => {
                if (error) {
                    setError(error.message);
                    setText(msgText);
                    return;
                }

                setError(null);
            })
        );
    };

    const handleRemoveMessage = (messageId) => {
        dispatch(deleteMessage(messageId));
    };

    return {
        text,
        setText,
        isLoading,
        error,
        setError,
        currentChatUserId,
        currentChatUserName,
        currentUserId,
        messages,
        handleSend,
        handleLoadHistory,
        handleRemoveMessage,
    };
};

export { useChat };
