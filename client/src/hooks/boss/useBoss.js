import { $api } from "../../http";
import { useDispatch, useSelector } from "react-redux";
import {
    setActiveBoss,
    setBossLoading,
    resetBoss,
} from "../../store/boss/bossBattleSlice";

const useBoss = (tasks = []) => {
    const dispatch = useDispatch();
    const boss = useSelector((state) => state.bossBattle);
    const loading = useSelector((state) => state.bossBattle.loading);

    const initBoss = async (forcedBossId = null) => {
        try {
            dispatch(setBossLoading(true));

            const payload = forcedBossId ? { bossId: forcedBossId } : {};
            const response = await $api.post("/boss/spawn", payload);
            const foundBoss = response.data?.boss || response.data;

            const now = new Date();
            const initiallyOverdue = tasks
                .filter(
                    (task) =>
                        !task.isCompleted &&
                        task.deadline &&
                        new Date(task.deadline) < now
                )
                .map((task) => task.id);

            dispatch(setActiveBoss({ ...foundBoss, initiallyOverdue }));
        } catch (error) {
            console.error(
                "Failed to spawn boss:",
                error.response?.data || error
            );
        } finally {
            dispatch(setBossLoading(false));
        }
    };

    const resetCurrentBoss = (defeated = false) => {
        dispatch(resetBoss({ defeated }));
    };

    const handleTaskCompleted = (isDead) => {
        if (isDead) {
            resetCurrentBoss(true);
        }
    };

    return {
        boss,
        initBoss,
        resetCurrentBoss,
        handleTaskCompleted,
        loading,
    };
};

export { useBoss };
