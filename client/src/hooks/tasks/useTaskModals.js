import {
    setInputTask,
    setModalActive,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
} from "../../store/tasks/tasksSlice";

const useTaskModals = ({ inputTask, dispatch }) => ({
    onInputChange: (value) => dispatch(setInputTask(value)),

    onOpenModal: () => {
        if (inputTask.trim()) {
            dispatch(setModalActive(true));
        } else {
            dispatch(setInputTask(inputTask));
        }
    },

    onCloseModal: () => dispatch(closeModal()),

    onOpenConfirmModal: (actionType, taskId, taskText) =>
        dispatch(openConfirmModal({ actionType, taskId, taskText })),

    onCloseConfirmModal: () => dispatch(closeConfirmModal()),
});

export { useTaskModals };
