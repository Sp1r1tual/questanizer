import { clearStatsState } from "../../store/stats/userStatsSlice";
import { clearTasksState } from "../../store/tasks/tasksSlice";
import { clearBossState } from "../../store/boss/bossBattleSlice";
import { clearUserProfileState } from "../../store/user/userProfileSlice";
import { clearFriendsState } from "../../store/user/userFriendsSlice";
import { clearPublicProfileState } from "../../store/user/publicUserProfileSlice";
import { clearMarketState } from "../../store/market/marketSlice";

const clearAllStateHelper = (dispatch) => {
    dispatch(clearStatsState());
    dispatch(clearTasksState());
    dispatch(clearBossState());
    dispatch(clearUserProfileState());
    dispatch(clearFriendsState());
    dispatch(clearPublicProfileState());
    dispatch(clearMarketState());
};

export { clearAllStateHelper };
