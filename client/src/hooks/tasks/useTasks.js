import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useBoss from "../boss/useBoss";
import useTaskModals from "./useTaskModals";

import {
    addTaskAsync,
    deleteTaskAsync,
    completeTaskAsync,
    markDamageTaken,
} from "../../store/tasks/tasksSlice";
import { markTaskAsRaged } from "../../store/boss/bossBattleSlice";
import { fetchStats } from "../../store/stats/userStatsSlice";
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

    const onConfirmAction = () => {
        const { actionType, taskId } = confirmModal;
        const task = tasks.find((t) => t._id === taskId);

        if (!task) return;

        if (actionType === "delete") {
            dispatch(deleteTaskAsync(taskId));
        } else if (actionType === "complete") {
            dispatch(completeTaskAsync(taskId)).then(() => {
                handleTaskCompleted(task.difficulty, !!task.deadline);
            });
        }
    };

    useEffect(() => {
        const checkOverdueTasks = async () => {
            const now = new Date();
            const overdueTasks = tasks.filter(
                (tasks) =>
                    !tasks.isCompleted &&
                    tasks.deadline &&
                    new Date(tasks.deadline) < now &&
                    !tasks.damageTaken
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
        onSetDeadline,
        onConfirmAction,
        loading,
    };
};

export default useTasks;
