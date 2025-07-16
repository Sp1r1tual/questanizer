import { useDispatch, useSelector } from "react-redux";
import {
    setModalActive,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    setIsInputInvalid,
} from "../../store/tasks/tasksSlice";

const useTaskModals = () => {
    const dispatch = useDispatch();
    const inputTask = useSelector((state) => state.tasks.inputTask);
    const modalActive = useSelector((state) => state.tasks.modalActive);
    const confirmModal = useSelector((state) => state.tasks.confirmModal);

    const onOpenModal = () => {
        const trimmed = inputTask.trim();

        if (!trimmed) {
            dispatch(setIsInputInvalid(true));
            return;
        }

        dispatch(setIsInputInvalid(false));
        dispatch(setModalActive(true));
    };

    const onCloseModal = () => dispatch(closeModal());

    const onOpenConfirmModal = (actionType, taskId, taskText) => {
        dispatch(openConfirmModal({ actionType, taskId, taskText }));
    };

    const onOpenGroupDeleteConfirmModal = (actionType) => {
        dispatch(openConfirmModal({ actionType, taskId: null, taskText: "" }));
    };

    const onCloseConfirmModal = () => dispatch(closeConfirmModal());

    return {
        modalActive,
        confirmModal,
        onOpenModal,
        onCloseModal,
        onOpenConfirmModal,
        onOpenGroupDeleteConfirmModal,
        onCloseConfirmModal,
    };
};

export default useTaskModals;
