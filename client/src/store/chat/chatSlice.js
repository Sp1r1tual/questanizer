import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        currentChatUserId: null,
        currentChatUserName: null,
    },
    reducers: {
        setCurrentChatUserId: (state, action) => {
            state.currentChatUserId = action.payload;
        },
        setCurrentChatUserName: (state, action) => {
            state.currentChatUserName = action.payload;
        },

        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            const messageExists = state.messages.some(
                (message) => message.id === action.payload.id
            );

            if (!messageExists) {
                state.messages.push(action.payload);
            }
        },
        markAsRead: (state, action) => {
            const { messageId, readerId, readAt } = action.payload;
            const message = state.messages.find((msg) => msg.id === messageId);

            if (!message) return;

            message.read = true;
            message.readAt = readAt;
            message.readBy = message.readBy || [];

            if (!message.readBy.includes(readerId)) {
                message.readBy.push(readerId);
            }
        },
        removeMessage: (state, action) => {
            state.messages = state.messages.filter(
                (msg) => msg.id !== action.payload
            );
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const {
    setMessages,
    addMessage,
    markAsRead,
    removeMessage,
    clearMessages,
    setCurrentChatUserId,
    setCurrentChatUserName,
} = chatSlice.actions;

export default chatSlice.reducer;
