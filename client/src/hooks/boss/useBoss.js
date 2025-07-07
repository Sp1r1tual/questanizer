import { $api } from "../../http";
import { useDispatch, useSelector } from "react-redux";
import { setActiveBoss, resetBoss } from "../../store/boss/bossBattleSlice";

const useBoss = (tasks = []) => {
    const dispatch = useDispatch();
    const boss = useSelector((state) => state.bossBattle);

    const initBoss = async (forcedBossId = null) => {
        try {
            if (boss.bossId) return;

            const payload = forcedBossId ? { bossId: forcedBossId } : {};
            const response = await $api.post("/boss/spawn", payload);
            const foundBoss = response.data;

            const now = new Date();
            const initiallyOverdue = tasks
                .filter(
                    (t) =>
                        !t.isCompleted &&
                        t.deadline &&
                        new Date(t.deadline) < now
                )
                .map((t) => t.id);

            dispatch(setActiveBoss({ ...foundBoss, initiallyOverdue }));
        } catch (err) {
            console.error("Failed to spawn boss:", err.response?.data || err);
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
    };
};

export default useBoss;
