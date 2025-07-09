import { useSelector, useDispatch } from "react-redux";

import {
    setInputTask,
    setModalActive,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    setDeadline,
} from "../../store/tasks/tasksSlice";

const useTaskModals = () => {
    const dispatch = useDispatch();
    const { inputTask, modalActive, confirmModal, deadline, isInputInvalid } =
        useSelector((state) => state.tasks);

    const onInputChange = (value) => dispatch(setInputTask(value));

    const onOpenModal = () => {
        if (inputTask.trim()) {
            dispatch(setModalActive(true));
        } else {
            dispatch(setInputTask(inputTask));
        }
    };

    const onCloseModal = () => dispatch(closeModal());

    const onOpenConfirmModal = (actionType, taskId, taskText) =>
        dispatch(openConfirmModal({ actionType, taskId, taskText }));

    const onOpenGroupDeleteConfirmModal = (actionType) =>
        dispatch(openConfirmModal({ actionType, taskId: null, taskText: "" }));

    const onCloseConfirmModal = () => dispatch(closeConfirmModal());

    const onSetDeadline = (dateStr) => dispatch(setDeadline(dateStr));

    return {
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
    };
};

export default useTaskModals;
