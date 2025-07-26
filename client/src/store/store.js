import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../store/tasks/tasksSlice";
import authReducer from "../store/auth/authSlice";
import userStatsReducer from "../store/stats/userStatsSlice";
import bossBattleReducer from "./boss/bossBattleSlice";
import userProfileReducer from "../store/user/userProfileSlice";
import userFriendsReducer from "../store/user/userFriendsSlice";
import publicUserProfileReducer from "../store/user/publicUserProfileSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        stats: userStatsReducer,
        bossBattle: bossBattleReducer,
        user: userProfileReducer,
        friends: userFriendsReducer,
        publicUser: publicUserProfileReducer,
    },
});

export { store };
