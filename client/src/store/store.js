import { configureStore } from "@reduxjs/toolkit";

import tasksReducer from "../store/tasks/tasksSlice";
import authReducer from "../store/auth/authSlice";
import userStatsReducer from "../store/stats/userStatsSlice";
import bossBattleReducer from "./boss/bossBattleSlice";
import userProfileReducer from "../store/user/userProfileSlice";
import userFriendsReducer from "../store/user/userFriendsSlice";
import publicUserProfileReducer from "../store/user/publicUserProfileSlice";
import faqReducer from "../store/support/faqSlice";
import marketReducer from "../store/market/marketSlice";
import inventoryReducer from "../store/user/inventorySlice";
import localizationReducer from "../store/user/localizationSlice";
import chatReducer from "../store/chat/chatSlice";
import chatSocketReducer from "../store/chat/chatSocketSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        auth: authReducer,
        stats: userStatsReducer,
        bossBattle: bossBattleReducer,
        user: userProfileReducer,
        friends: userFriendsReducer,
        publicUser: publicUserProfileReducer,
        faq: faqReducer,
        market: marketReducer,
        inventory: inventoryReducer,
        localization: localizationReducer,
        chat: chatReducer,
        chatSocket: chatSocketReducer,
    },
});

export { store };
