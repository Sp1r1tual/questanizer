import { TaskService } from "../../services/tasksService";
import { fetchStats } from "../../store/stats/userStatsSlice";
import { markDamageTaken } from "../../store/tasks/tasksSlice";

const useTaskImpacts = ({ tasks, dispatch }) => {
    const checkOverdueTasks = async () => {
        const now = new Date();

        const overdueTasks = tasks.filter(
            (task) =>
                !task.isCompleted &&
                task.deadline &&
                task.difficulty &&
                !task.damageTaken
        );

        for (const task of overdueTasks) {
            const deadlineDate = new Date(task.deadline);

            if (!isNaN(deadlineDate.getTime()) && deadlineDate < now) {
                try {
                    await TaskService.takeDamageOverdueTask(task._id);
                    dispatch(markDamageTaken(task._id));
                    dispatch(fetchStats());
                } catch (error) {
                    console.error("Failed to apply overdue damage:", error);
                }
            }
        }
    };

    return {
        checkOverdueTasks,
    };
};

export default useTaskImpacts;
