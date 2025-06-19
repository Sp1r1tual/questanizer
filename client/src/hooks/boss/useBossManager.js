import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveBoss, resetBoss } from "../../store/boss/bossBattleSlice";
import bosses from "../../data/bosses";

const useBossManager = () => {
    const dispatch = useDispatch();
    const boss = useSelector((state) => state.bossBattle);
    const tasks = useSelector((state) => state.tasks.tasks);

    const initBoss = useCallback(
        (forcedIndex) => {
            const bossIndex = forcedIndex ?? boss.currentBossIndex ?? 0;

            if (bossIndex >= bosses.length) {
                alert("🎉 You have defeated all available bosses!");
                return;
            }

            const foundBoss = bosses[bossIndex];

            if (foundBoss && !boss.bossId) {
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
            }
        },
        [boss.bossId, boss.currentBossIndex, dispatch, tasks]
    );

    const resetCurrentBoss = (defeated = false) => {
        dispatch(resetBoss({ defeated }));
    };

    return {
        boss,
        initBoss,
        resetCurrentBoss,
    };
};

export { useBossManager };
