import { useSelector, useDispatch } from "react-redux";
import { useBossBattle } from "./useBossBattle";

import {
    setInputTask,
    setModalActive,
    addTask,
    closeModal,
    deleteTask,
    completeTask,
    setDeadline,
    openConfirmModal,
    closeConfirmModal,
} from "../store/tasks/tasksSlice";
import { gainExperience, takeDamage } from "../store/stats/userStatsSlice";
import { DIFFICULTY_REWARDS } from "../config/statsConfig";

const useTasks = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.tasks);
    const { handleTaskCompleted } = useBossBattle();

    const awardExperience = (difficulty, hasDeadline) => {
        const reward = DIFFICULTY_REWARDS[difficulty];

        if (!reward) return;

        let xp = reward.xp;

        if (!hasDeadline) {
            xp = Math.floor(xp / 5);
        }

        dispatch(gainExperience(xp));
    };

    const applyOverdueDamage = (difficulty) => {
        const reward = DIFFICULTY_REWARDS[difficulty];

        if (!reward) return;

        dispatch(takeDamage(reward.damage));
    };

    const checkOverdueTasks = () => {
        const now = new Date();

        state.tasks.forEach((task) => {
            if (!task.isCompleted && task.deadline && task.difficulty) {
                const deadlineDate = new Date(task.deadline);

                if (now > deadlineDate && !task.damageTaken) {
                    applyOverdueDamage(task.difficulty);

                    dispatch({
                        type: "tasks/markDamageTaken",
                        payload: task.id,
                    });
                }
            }
        });
    };

    return {
        ...state,

        onInputChange: (value) => dispatch(setInputTask(value)),

        onOpenModal: () => {
            if (state.inputTask.trim()) {
                dispatch(setModalActive(true));
            } else {
                dispatch(setInputTask(state.inputTask));
            }
        },

        onAddTask: ({ hasDeadline, difficulty }) => {
            dispatch(addTask({ hasDeadline, difficulty }));
        },

        onCloseModal: () => dispatch(closeModal()),

        onDeleteTask: (id) => {
            const task = state.tasks.find((t) => t.id === id);

            if (task) {
                dispatch(
                    openConfirmModal({
                        actionType: "delete",
                        taskId: id,
                        taskText: task.text,
                    })
                );
            }
        },

        onCompleteTask: (id) => {
            const task = state.tasks.find((t) => t.id === id);

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
        },

        onSetDeadline: (dateStr) => dispatch(setDeadline(dateStr)),

        onOpenConfirmModal: (actionType, taskId, taskText) => {
            dispatch(openConfirmModal({ actionType, taskId, taskText }));
        },

        onCloseConfirmModal: () => dispatch(closeConfirmModal()),

        onConfirmAction: () => {
            const { actionType, taskId } = state.confirmModal;

            if (actionType === "delete") {
                dispatch(deleteTask(taskId));
            } else if (actionType === "complete") {
                const task = state.tasks.find((t) => t.id === taskId);

                if (task && task.difficulty) {
                    awardExperience(task.difficulty, !!task.deadline);
                    handleTaskCompleted(task.difficulty);
                }
                dispatch(completeTask(taskId));
            }
        },

        checkOverdueTasks,
        awardExperience,
        applyOverdueDamage,
    };
};

export { useTasks };
