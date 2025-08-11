import { useDispatch, useSelector } from "react-redux";

import { useBoss } from "../boss/useBoss";

import { closeConfirmModal, openConfirmModal } from "@/store/tasks/tasksSlice";

import { deleteTaskAsync, completeTaskAsync } from "@/store/tasks/tasksThunks";

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
            dispatch(completeTaskAsync(taskId)).then(() => {
                handleTaskCompleted(task.difficulty, !!task.deadline);
            });
        }
    };

    const handleGroupDelete = (filterFn) => {
        tasks
            .filter(filterFn)
            .forEach((task) => dispatch(deleteTaskAsync(task._id)));
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
                console.warn("Unknown action type:", actionType);
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
    };
};

export { useTaskActions };
