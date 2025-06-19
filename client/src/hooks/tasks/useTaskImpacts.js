import { takeDamage } from "../../store/stats/userStatsSlice";
import { markDamageTaken } from "../../store/tasks/tasksSlice";
import { gainExperience } from "../../store/stats/userStatsSlice";
import { DIFFICULTY_REWARDS } from "../../config/statsConfig";

const useTaskImpacts = ({ tasks, dispatch }) => {
    const awardExperience = (difficulty, hasDeadline) => {
        const reward = DIFFICULTY_REWARDS[difficulty];

        if (!reward) return;

        let xp = reward.xp;

        if (!hasDeadline) xp = Math.floor(xp / 5);
        dispatch(gainExperience(xp));
    };

    const applyOverdueDamage = (difficulty) => {
        const reward = DIFFICULTY_REWARDS[difficulty];

        if (!reward) return;

        dispatch(takeDamage(reward.damage));
    };

    const checkOverdueTasks = () => {
        const now = new Date();

        const overdueTasks = tasks.filter(
            (task) =>
                !task.isCompleted &&
                task.deadline &&
                task.difficulty &&
                !task.damageTaken
        );
        overdueTasks.forEach((task) => {
            const deadlineDate = new Date(task.deadline);

            if (!isNaN(deadlineDate.getTime()) && deadlineDate < now) {
                applyOverdueDamage(task.difficulty);
                dispatch(markDamageTaken(task.id));
            }
        });
    };

    return {
        awardExperience,
        applyOverdueDamage,
        checkOverdueTasks,
    };
};

export { useTaskImpacts };
