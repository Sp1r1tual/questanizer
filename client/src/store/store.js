import { configureStore } from "@reduxjs/toolkit";
import tasksReducer, { fetchTasks } from "../store/tasks/tasksSlice";
import authReducer, { checkAuth } from "../store/auth/authSlice";
import userStatsReducer from "../store/stats/userStatsSlice";
import bossBattleReducer from "./boss/bossBattleSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        stats: userStatsReducer,
        bossBattle: bossBattleReducer,
    },
});

const token = localStorage.getItem("token");
if (token) {
    store.dispatch(checkAuth());
    store.dispatch(fetchTasks());
}

export { store, token };
