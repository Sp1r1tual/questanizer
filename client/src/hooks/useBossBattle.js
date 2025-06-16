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
            }
        },
        [boss.bossId, dispatch]
    );

    const handleTaskCompleted = (difficulty, hasDeadline) => {
        const baseDamage = DIFFICULTY_REWARDS[difficulty]?.damage || 0;

        const damageAmount = hasDeadline
            ? baseDamage
            : Math.floor(baseDamage / 5);

        dispatch(takeDamage(damageAmount));
        dispatch(updateHealthBar());

        const newHealth = boss.healthPoints - damageAmount;

        if (boss.bossId && newHealth <= 0) {
            addXP(boss.bossRewardExp);
            alert(`🎉 Victory on ${boss.bossName}! +${boss.bossRewardExp} XP`);
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
                if (boss.bossName && boss.bossPower) {
                    alert(
                        `⚔️ ${boss.bossName} attacks and causes ${boss.bossPower} damage!`
                    );
                } else {
                    console.warn("Boss data is incomplete:", boss);
                }
                damage(boss.bossPower);
                dispatch(resetRage());
            }
        }
    }, [tasks, boss, dispatch, damage]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (boss.bossId) {
                handleOverdueTasks();
            }
        }, 500);

        return () => clearInterval(interval);
    }, [handleOverdueTasks, boss.bossId]);

    return {
        boss,
        initBoss,
        handleTaskCompleted,
    };
};

export { useBossBattle };
