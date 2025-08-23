import { useSelector, useDispatch } from "react-redux";

import { useTaskModal } from "./useTaskModal";
import { useTaskInput } from "./useTaskInput";
import { useTaskActions } from "./useTaskActions";

import { addTaskAsync } from "@/store/tasks/tasksThunks";

const useTasks = () => {
  const dispatch = useDispatch();

  const { tasks, loading, hasLoaded } = useSelector((state) => state.tasks);

  const { inputTask, deadline, isInputInvalid, onInputChange, onSetDeadline } = useTaskInput();

  const onAddTask = ({ hasDeadline, difficulty }) => {
    const trimmed = inputTask.trim();

    if (!trimmed || (hasDeadline && !deadline)) return { success: false };

    dispatch(
      addTaskAsync({
        text: trimmed,
        deadline: hasDeadline ? deadline : null,
        difficulty,
      }),
    );

    return { success: true };
  };

  const {
    modalActive,
    confirmModal,
    onOpenModal,
    onCloseModal,
    onOpenConfirmModal,
    onOpenGroupDeleteConfirmModal,
    onCloseConfirmModal,
  } = useTaskModal({
    deadline,
    setDeadline: onSetDeadline,
    onSubmit: onAddTask,
  });

  const { onDeleteTask, onCompleteTask, onConfirmAction } = useTaskActions();

  const onGroupDeleteCompleted = () => onOpenGroupDeleteConfirmModal("group-delete-completed");

  const onGroupDeleteOverdue = () => onOpenGroupDeleteConfirmModal("group-delete-overdue");

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
