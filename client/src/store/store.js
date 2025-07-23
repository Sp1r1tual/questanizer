import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/tasks/tasksSlice";
import authReducer from "../store/auth/authSlice";
import userReducer from "../store/user/userSlice";

import userStatsReducer from "../store/stats/userStatsSlice";
import bossBattleReducer from "./boss/bossBattleSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        stats: userStatsReducer,
        bossBattle: bossBattleReducer,
        user: userReducer,
    },
});

export { store };
