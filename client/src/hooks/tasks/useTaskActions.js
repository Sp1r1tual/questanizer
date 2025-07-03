import { useBoss } from "../boss/useBoss";

import {
    addTaskAsync,
    deleteTaskAsync,
    completeTaskAsync,
    openConfirmModal,
    setDeadline,
} from "../../store/tasks/tasksSlice";

const useTaskActions = ({
    tasks,
    confirmModal,
    dispatch,
    inputTask,
    deadline,
}) => {
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
        const task = tasks.find((t) => t._id === _id);

        if (!task) return;

        dispatch(
            openConfirmModal({
                actionType: "delete",
                taskId: _id,
                taskText: task.text,
            })
        );
    };

    const onCompleteTask = (_id) => {
        const task = tasks.find((t) => t._id === _id);

        if (!task) return;
        if (task.isCompleted) return;

        dispatch(
            openConfirmModal({
                actionType: "complete",
                taskId: _id,
                taskText: task.text,
            })
        );
    };

    const onSetDeadline = (dateStr) => {
        dispatch(setDeadline(dateStr));
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

    return {
        onAddTask,
        onDeleteTask,
        onCompleteTask,
        onSetDeadline,
        onConfirmAction,
    };
};

export default useTaskActions;
