import { useSelector, useDispatch } from "react-redux";

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

function useTasks() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.tasks);

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
                dispatch(completeTask(taskId));
            }
        },
    };
}

export { useTasks };
