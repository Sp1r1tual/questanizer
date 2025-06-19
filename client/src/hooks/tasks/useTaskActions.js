import { useBoss } from "../boss/useBoss";

import {
    addTask,
    deleteTask,
    completeTask,
    openConfirmModal,
} from "../../store/tasks/tasksSlice";
import { setDeadline } from "../../store/tasks/tasksSlice";
import { DIFFICULTY_REWARDS } from "../../config/statsConfig";
import { gainExperience } from "../../store/stats/userStatsSlice";

export const useTaskActions = ({ tasks, confirmModal, dispatch }) => {
    const { handleTaskCompleted } = useBoss();

    const onAddTask = ({ hasDeadline, difficulty }) =>
        dispatch(addTask({ hasDeadline, difficulty }));

    const onDeleteTask = (id) => {
        const task = tasks.find((t) => t.id === id);

        if (task) {
            dispatch(
                openConfirmModal({
                    actionType: "delete",
                    taskId: id,
                    taskText: task.text,
                })
            );
        }
    };

    const onCompleteTask = (id) => {
        const task = tasks.find((t) => t.id === id);

        if (task) {
            if (task.isCompleted) {
                dispatch(completeTask(id));
            } else {
                dispatch(
                    openConfirmModal({
                        actionType: "complete",
                        taskId: id,
                        taskText: task.text,
                    })
                );
            }
        }
    };

    const onSetDeadline = (dateStr) => dispatch(setDeadline(dateStr));

    const onConfirmAction = () => {
        const { actionType, taskId } = confirmModal;
        const task = tasks.find((t) => t.id === taskId);

        if (actionType === "delete") {
            dispatch(deleteTask(taskId));
        } else if (actionType === "complete" && task && task.difficulty) {
            let xp = DIFFICULTY_REWARDS[task.difficulty]?.xp || 0;

            if (!task.deadline) xp = Math.floor(xp / 5);
            dispatch(gainExperience(xp));
            handleTaskCompleted(task.difficulty, !!task.deadline);
            dispatch(completeTask(taskId));
        }
    };

    return {
        onAddTask,
        onDeleteTask,
        onCompleteTask,
        onSetDeadline,
        onConfirmAction,
    };
};
