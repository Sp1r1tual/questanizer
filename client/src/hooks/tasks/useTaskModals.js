import { useDispatch, useSelector } from "react-redux";

import {
    setModalActive,
    closeModal,
    openConfirmModal,
} from "../../store/tasks/tasksSlice";

const useTaskModals = () => {
    const dispatch = useDispatch();
    const inputTask = useSelector((state) => state.tasks.inputTask);
    const modalActive = useSelector((state) => state.tasks.modalActive);
    const confirmModal = useSelector((state) => state.tasks.confirmModal);

    const onOpenModal = () => {
        if (!inputTask.trim()) return;
        dispatch(setModalActive(true));
    };

    const onCloseModal = () => dispatch(closeModal());

    const onOpenConfirmModal = (actionType, taskId, taskText) => {
        dispatch(openConfirmModal({ actionType, taskId, taskText }));
    };

    const onOpenGroupDeleteConfirmModal = (actionType) => {
        dispatch(openConfirmModal({ actionType, taskId: null, taskText: "" }));
    };

    return {
        modalActive,
        confirmModal,
        onOpenModal,
        onCloseModal,
        onOpenConfirmModal,
        onOpenGroupDeleteConfirmModal,
    };
};

export default useTaskModals;
