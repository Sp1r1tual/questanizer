import { useSelector, useDispatch } from "react-redux";

import { useTaskModals } from "./useTaskModals";
import { useOverdueTasksChecker } from "./useOverdueTasksChecker";
import { useTaskInput } from "./useTaskInput";
import { useTaskActions } from "./useTaskActions";

import { addTaskAsync } from "@/store/tasks/tasksThunks";

const useTasks = () => {
    const dispatch = useDispatch();

    const { tasks, loading, hasLoaded } = useSelector((state) => state.tasks);

    const {
        modalActive,
        confirmModal,
        onOpenModal,
        onCloseModal,
        onOpenConfirmModal,
        onOpenGroupDeleteConfirmModal,
        onCloseConfirmModal,
    } = useTaskModals();

    const {
        inputTask,
        deadline,
        isInputInvalid,
        onInputChange,
        onSetDeadline,
    } = useTaskInput();

    const { onDeleteTask, onCompleteTask, onConfirmAction } = useTaskActions();

    useOverdueTasksChecker();

    const onAddTask = ({ hasDeadline, difficulty }) => {
        const trimmed = inputTask.trim();

        if (!trimmed || (hasDeadline && !deadline)) return;

        dispatch(
            addTaskAsync({
                text: trimmed,
                deadline: hasDeadline ? deadline : null,
                difficulty,
            })
        );
    };

    const onGroupDeleteCompleted = () =>
        onOpenGroupDeleteConfirmModal("group-delete-completed");

    const onGroupDeleteOverdue = () =>
        onOpenGroupDeleteConfirmModal("group-delete-overdue");

    return {
        tasks,
        loading,
        hasLoaded,
        inputTask,
        deadline,
        isInputInvalid,
        modalActive,
        confirmModal,
        onInputChange,
        onSetDeadline,
        onOpenModal,
        onCloseModal,
        onOpenConfirmModal,
        onCloseConfirmModal,
        onAddTask,
        onConfirmAction,
        onDeleteTask,
        onCompleteTask,
        onGroupDeleteCompleted,
        onGroupDeleteOverdue,
    };
};

export { useTasks };
