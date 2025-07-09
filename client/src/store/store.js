import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/tasks/tasksSlice";
import authReducer from "../store/auth/authSlice";
import { checkAuth } from "./auth/authThunks";
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

// TODO: Not called in the App.jsx. Requires a fix
const token = localStorage.getItem("token");
if (token) {
    store.dispatch(checkAuth());
}

export { store, token };
