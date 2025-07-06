import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markTaskAsRaged } from "../../store/boss/bossBattleSlice";
import { TaskService } from "../../services/tasksService";
import { fetchStats } from "../../store/stats/userStatsSlice";

const useBossCombat = () => {
    const dispatch = useDispatch();
    const boss = useSelector((state) => state.bossBattle);
    const tasks = useSelector((state) => state.tasks.tasks);

    const handleOverdueTasks = async () => {
        if (!boss.bossId) return;

        const now = new Date();
        const overdueTaskIds = tasks
            .filter(
                (t) =>
                    !t.isCompleted &&
                    t.deadline &&
                    new Date(t.deadline) < now &&
                    !t.damageTaken
            )
            .map((t) => t._id);

        if (overdueTaskIds.length === 0) return;

        for (const taskId of overdueTaskIds) {
            try {
                await TaskService.takeDamageOverdueTask(taskId);
                dispatch(markTaskAsRaged(taskId));
                dispatch(fetchStats());
            } catch (error) {
                console.error("Failed to apply overdue damage:", error);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleOverdueTasks();
        }, 60000);

        return () => clearInterval(interval);
    }, [boss.bossId, tasks]);

    return {
        handleOverdueTasks,
    };
};

export default useBossCombat;
