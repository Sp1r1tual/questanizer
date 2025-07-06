import { clearStatsState } from "../store/stats/userStatsSlice";
import { clearTasksState } from "../store/tasks/tasksSlice";
import { clearBossState } from "../store/boss/bossBattleSlice";

const clearAllStateHelper = (dispatch) => {
    dispatch(clearStatsState());
    dispatch(clearTasksState());
    dispatch(clearBossState());
};

export default clearAllStateHelper;
