import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/tasks/tasksSlice";

export const store = configureStore({
    reducer: { tasks: tasksReducer },
});
