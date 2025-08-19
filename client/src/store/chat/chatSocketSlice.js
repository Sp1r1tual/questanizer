import { createSlice } from "@reduxjs/toolkit";

const chatSocketSlice = createSlice({
  name: "chatSocket",
  initialState: {
    status: "idle",
    socketId: null,
    error: null,
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setStatus, setSocketId, setError } = chatSocketSlice.actions;

export default chatSocketSlice.reducer;
