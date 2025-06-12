import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/tasks/tasksSlice";
import authReducer from "../store/auth/authSlice";
import userStatsReducer from "../store/stats/userStatsSlice";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        stats: userStatsReducer,
    },
});
