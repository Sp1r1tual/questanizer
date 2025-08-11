import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { TaskService } from "@/services/tasksService";

import { markDamageTaken } from "@/store/tasks/tasksSlice";
import { markTaskAsRaged } from "@/store/boss/bossBattleSlice";

import { fetchStats } from "@/store/stats/userStatsThunks";

const useOverdueTasksChecker = () => {
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.tasks.tasks);
    const bossId = useSelector((state) => state.bossBattle.bossId);
    const alreadyRagedTaskIds = useSelector(
        (state) => state.bossBattle.alreadyRagedTaskIds
    );

    useEffect(() => {
        const checkOverdueTasks = async () => {
            const now = new Date();

            const overdueTasks = tasks.filter(
                (t) =>
                    !t.isCompleted &&
                    t.deadline &&
                    new Date(t.deadline) < now &&
                    !t.damageTaken
            );

            if (!overdueTasks.length) return;

            const overdueTaskIds = [];

            for (const task of overdueTasks) {
                try {
                    await TaskService.takeDamageOverdueTask(task._id);

                    overdueTaskIds.push(task._id);

                    dispatch(markDamageTaken(task._id));

                    if (bossId && !alreadyRagedTaskIds.includes(task._id)) {
                        dispatch(markTaskAsRaged(task._id));
                    }
                } catch (error) {
                    console.error("Overdue damage error:", error);
                }
            }

            if (overdueTaskIds.length) {
                dispatch(fetchStats());
            }
        };

        checkOverdueTasks();

        const interval = setInterval(checkOverdueTasks, 60000);

        return () => clearInterval(interval);
    }, [tasks, dispatch, bossId, alreadyRagedTaskIds]);
};

export { useOverdueTasksChecker };
