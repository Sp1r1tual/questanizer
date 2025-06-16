import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUserStats } from "./useUserStats";

import {
    setActiveBoss,
    takeDamage,
    updateRageBar,
    updateHealthBar,
    resetBoss,
    markTaskAsRaged,
    resetRage,
} from "../store/boss/bossBattleSlice";

import { DIFFICULTY_REWARDS } from "../config/statsConfig";
import bosses from "../data/bosses";

const useBossBattle = () => {
    const dispatch = useDispatch();
    const boss = useSelector((state) => state.bossBattle);
    const tasks = useSelector((state) => state.tasks.tasks);
    const { addXP, damage } = useUserStats();

    const initBoss = useCallback(
        (bossId) => {
            if (!boss.bossId) {
                const foundBoss = bosses.find((b) => b.bossId === bossId);
                if (foundBoss) {
                    dispatch(setActiveBoss(foundBoss));
                }
            }
        },
        [boss.bossId, dispatch]
    );

    const handleTaskCompleted = (difficulty, hasDeadline) => {
        let damageAmount = DIFFICULTY_REWARDS[difficulty]?.damage || 0;

        if (!hasDeadline) {
            damageAmount = Math.floor(damageAmount / 5);
        }

        dispatch(takeDamage(damageAmount));
        dispatch(updateHealthBar());

        if (boss.healthPoints - damageAmount <= 0) {
            addXP(boss.bossRewardExp);
            dispatch(resetBoss());
        }
    };

    const handleOverdueTasks = useCallback(() => {
        const now = new Date();
        const newRagedTasks = [];

        for (const task of tasks) {
            const isOverdue =
                !task.isCompleted &&
                task.deadline &&
                new Date(task.deadline) < now;

            const isAlreadyRaged = boss.alreadyRagedTaskIds?.includes(task.id);

            if (isOverdue && !isAlreadyRaged) {
                newRagedTasks.push(task.id);
            }
        }

        if (newRagedTasks.length > 0) {
            const totalNewRage = newRagedTasks.length;
            const projectedRage = boss.rage + totalNewRage;

            dispatch(updateRageBar(totalNewRage));

            newRagedTasks.forEach((taskId) => {
                dispatch(markTaskAsRaged(taskId));
            });

            if (projectedRage >= boss.bossRageBar) {
                alert(
                    `⚔️ ${boss.bossName} attacks and causes ${boss.bossPower} damage!`
                );
                damage(boss.bossPower);
                dispatch(resetRage());
            }
        }
    }, [
        tasks,
        boss.alreadyRagedTaskIds,
        boss.bossRageBar,
        boss.rage,
        boss.bossPower,
        dispatch,
        damage,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            handleOverdueTasks();
        }, 500);

        return () => clearInterval(interval);
    }, [handleOverdueTasks]);

    return {
        boss,
        initBoss,
        handleTaskCompleted,
    };
};

export { useBossBattle };
