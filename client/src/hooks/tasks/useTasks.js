import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useBoss from "../boss/useBoss";
import useTaskModals from "./useTaskModals";

import { markDamageTaken } from "../../store/tasks/tasksSlice";
import {
    addTaskAsync,
    deleteTaskAsync,
    completeTaskAsync,
} from "../../store/tasks/tasksThunks";
import { markTaskAsRaged } from "../../store/boss/bossBattleSlice";
import { fetchStats } from "../../store/stats/userStatsThunks";
import { TaskService } from "../../services/tasksService";

const useTasks = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);
    const bossId = useSelector((state) => state.bossBattle.bossId);
    const alreadyRagedTaskIds = useSelector(
        (state) => state.bossBattle.alreadyRagedTaskIds
    );
    const loading = useSelector((state) => state.tasks.loading);

    const {
        inputTask,
        modalActive,
        confirmModal,
        deadline,
        isInputInvalid,
        onInputChange,
        onOpenModal,
        onCloseModal,
        onOpenConfirmModal,
        onOpenGroupDeleteConfirmModal,
        onCloseConfirmModal,
        onSetDeadline,
    } = useTaskModals();

    const { handleTaskCompleted } = useBoss();

    const onAddTask = ({ hasDeadline, difficulty }) => {
        if (!inputTask.trim()) return;

        if (hasDeadline && !deadline) return;

        dispatch(
            addTaskAsync({
                text: inputTask.trim(),
                deadline: hasDeadline ? deadline : null,
                difficulty,
            })
        );
    };

    const onDeleteTask = (_id) => {
        const task = tasks.find((task) => task._id === _id);

        if (!task) return;

        onOpenConfirmModal("delete", _id, task.text);
    };

    const onCompleteTask = (_id) => {
        const task = tasks.find((task) => task._id === _id);

        if (!task || task.isCompleted) return;

        onOpenConfirmModal("complete", _id, task.text);
    };

    const onGroupDeleteCompleted = () => {
        onOpenGroupDeleteConfirmModal("group-delete-completed");
    };

    const onGroupDeleteOverdue = () => {
        onOpenGroupDeleteConfirmModal("group-delete-overdue");
    };

    const onConfirmAction = () => {
        const { actionType, taskId } = confirmModal;

        if (actionType === "delete") {
            const task = tasks.find((t) => t._id === taskId);

            if (!task) return;

            dispatch(deleteTaskAsync(taskId));
        } else if (actionType === "complete") {
            const task = tasks.find((t) => t._id === taskId);

            if (!task) return;

            dispatch(completeTaskAsync(taskId)).then(() => {
                handleTaskCompleted(task.difficulty, !!task.deadline);
            });
        } else if (actionType === "group-delete-completed") {
            const completedTasks = tasks.filter((t) => t.isCompleted);

            completedTasks.forEach((task) => {
                dispatch(deleteTaskAsync(task._id));
            });
        } else if (actionType === "group-delete-overdue") {
            const now = new Date();

            const overdueTasks = tasks.filter(
                (t) =>
                    !t.isCompleted && t.deadline && new Date(t.deadline) < now
            );

            overdueTasks.forEach((task) => {
                dispatch(deleteTaskAsync(task._id));
            });
        }

        onCloseConfirmModal();
    };

    useEffect(() => {
        const checkOverdueTasks = async () => {
            const now = new Date();

            const overdueTasks = tasks.filter(
                (task) =>
                    !task.isCompleted &&
                    task.deadline &&
                    new Date(task.deadline) < now &&
                    !task.damageTaken
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
                    console.error("Overdue task damage failed", error);
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

    return {
        tasks,
        inputTask,
        modalActive,
        confirmModal,
        deadline,
        isInputInvalid,
        onInputChange,
        onOpenModal,
        onCloseModal,
        onOpenConfirmModal,
        onCloseConfirmModal,
        onAddTask,
        onDeleteTask,
        onCompleteTask,
        onGroupDeleteCompleted,
        onGroupDeleteOverdue,
        onSetDeadline,
        onConfirmAction,
        loading,
    };
};

export default useTasks;
