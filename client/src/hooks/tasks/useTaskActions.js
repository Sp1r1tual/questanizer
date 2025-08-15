import { useDispatch, useSelector } from "react-redux";

import { useBoss } from "../boss/useBoss";

import { TaskService } from "@/services/tasksService";

import {
    closeConfirmModal,
    openConfirmModal,
    markDamageTaken,
} from "@/store/tasks/tasksSlice";
import { markTaskAsRaged } from "@/store/boss/bossBattleSlice";

import { deleteTaskAsync, completeTaskAsync } from "@/store/tasks/tasksThunks";
import { fetchStats } from "@/store/stats/userStatsThunks";
import { fetchBoss } from "@/store/boss/bossBattleThunks";

const useTaskActions = () => {
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.tasks.tasks);
    const confirmModal = useSelector((state) => state.tasks.confirmModal);

    const { handleTaskCompleted } = useBoss();

    const findTask = (id) => tasks.find((t) => t._id === id);

    const onDeleteTask = (taskId) => {
        const task = findTask(taskId);

        if (task) {
            dispatch(
                openConfirmModal({
                    actionType: "delete",
                    taskId,
                    taskText: task.text,
                })
            );
        }
    };

    const onCompleteTask = (taskId) => {
        const task = findTask(taskId);

        if (task && !task.isCompleted) {
            dispatch(
                openConfirmModal({
                    actionType: "complete",
                    taskId,
                    taskText: task.text,
                })
            );
        }
    };

    const handleDelete = (taskId) => {
        const task = findTask(taskId);

        if (task) dispatch(deleteTaskAsync(taskId));
    };

    const handleComplete = (taskId) => {
        const task = findTask(taskId);

        if (task) {
            return dispatch(completeTaskAsync(taskId)).then(() => {
                handleTaskCompleted(task.difficulty, !!task.deadline);
            });
        }
    };

    const handleGroupDelete = (filterFn) => {
        tasks
            .filter(filterFn)
            .forEach((task) => dispatch(deleteTaskAsync(task._id)));
    };

    const handleOverdueConfirm = async ({
        completedTaskIds,
        uncompletedTaskIds,
        bossId,
        alreadyRagedTaskIds,
    }) => {
        for (const taskId of completedTaskIds) {
            try {
                await handleComplete(taskId);
            } catch (error) {
                console.error("Error completing task:", taskId, error);
            }
        }

        const overdueTaskIds = [];

        for (const taskId of uncompletedTaskIds) {
            try {
                await TaskService.takeDamageOverdueTask(taskId);

                overdueTaskIds.push(taskId);

                dispatch(markDamageTaken(taskId));

                if (bossId && !alreadyRagedTaskIds.includes(taskId)) {
                    dispatch(markTaskAsRaged(taskId));
                    dispatch(fetchBoss());
                }
            } catch (error) {
                console.error("Overdue damage error:", taskId, error);
            }
        }

        if (overdueTaskIds.length) {
            dispatch(fetchStats());
        }
    };

    const onConfirmAction = () => {
        const { actionType, taskId } = confirmModal;
        const now = new Date();

        switch (actionType) {
            case "delete":
                handleDelete(taskId);
                break;
            case "complete":
                handleComplete(taskId);
                break;
            case "group-delete-completed":
                handleGroupDelete((t) => t.isCompleted);
                break;
            case "group-delete-overdue":
                handleGroupDelete(
                    (t) =>
                        !t.isCompleted &&
                        t.deadline &&
                        new Date(t.deadline) < now
                );
                break;
            default:
                console.error("Unknown action type:", actionType);
        }
        dispatch(closeConfirmModal());
    };

    return {
        onDeleteTask,
        onCompleteTask,
        onConfirmAction,
        handleDelete,
        handleComplete,
        handleGroupDelete,
        handleOverdueConfirm,
    };
};

export { useTaskActions };
