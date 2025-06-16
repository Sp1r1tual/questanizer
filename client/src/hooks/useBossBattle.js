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

    const handleTaskCompleted = (difficulty) => {
        const damageAmount = DIFFICULTY_REWARDS[difficulty]?.damage || 0;
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
            dispatch(updateRageBar(newRagedTasks.length));
            newRagedTasks.forEach((taskId) => {
                dispatch(markTaskAsRaged(taskId));
            });
        }
    }, [tasks, boss.alreadyRagedTaskIds, dispatch]);

    useEffect(() => {
        if (boss.rage >= boss.bossRageBar && boss.bossId) {
            damage(boss.bossPower);
            dispatch(resetRage());
        }
    }, [
        boss.rage,
        boss.bossRageBar,
        boss.bossPower,
        boss.bossId,
        dispatch,
        damage,
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            handleOverdueTasks();
        }, 10000);

        return () => clearInterval(interval);
    }, [handleOverdueTasks]);

    return {
        boss,
        initBoss,
        handleTaskCompleted,
    };
};

export { useBossBattle };
