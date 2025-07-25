import { clearStatsState } from "../../store/stats/userStatsSlice";
import { clearTasksState } from "../../store/tasks/tasksSlice";
import { clearBossState } from "../../store/boss/bossBattleSlice";
import { clearUserProfileState } from "../../store/user/userProfileSlice";
import { clearFriendsState } from "../../store/user/userFriendsSlice";

const clearAllStateHelper = (dispatch) => {
    dispatch(clearStatsState());
    dispatch(clearTasksState());
    dispatch(clearBossState());
    dispatch(clearUserProfileState());
    dispatch(clearFriendsState());
};

export default clearAllStateHelper;
