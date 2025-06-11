import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/tasks/tasksSlice";
import authReducer from "../store/auth/authSlice";

export const store = configureStore({
    reducer: { tasks: tasksReducer, auth: authReducer },
});
