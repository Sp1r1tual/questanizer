import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setModalActive,
  closeModal,
  openConfirmModal,
  closeConfirmModal,
  setIsInputInvalid,
} from "@/store/tasks/tasksSlice";

import { isDateValid } from "@/utils/validation/isDateValid";

const useTaskModal = (params = {}) => {
  const dispatch = useDispatch();

  const { deadline, setDeadline, onSubmit } = params;

  const [isDateInvalid, setIsDateInvalid] = useState(false);
  const [modalContent, setModalContent] = useState("deadline");
  const [difficulty, setDifficulty] = useState(null);

  const inputTask = useSelector((state) => state.tasks.inputTask);
  const modalActive = useSelector((state) => state.tasks.modalActive);
  const confirmModal = useSelector((state) => state.tasks.confirmModal);

  const handleDateChange = (event) => {
    const newDate = event.target.value;

    setDeadline(newDate);
    setIsDateInvalid(!isDateValid(newDate));
  };

  const handleAddWithDeadline = () => {
    if (!deadline || !isDateValid(deadline)) {
      setIsDateInvalid(true);
      return;
    }
    setModalContent("difficulty");
  };

  const handleAddWithoutDeadline = () => {
    setDeadline("");
    setIsDateInvalid(false);
    setModalContent("difficulty");
  };

  const handleBack = () => {
    setModalContent("deadline");
    setDifficulty(null);
  };

  const handleFinalSubmit = async () => {
    if (!difficulty) return;

    const result = await onSubmit({
      hasDeadline: !!deadline,
      difficulty,
    });

    if (result?.success) {
      onCloseModal();
    }
  };

  const onOpenModal = () => {
    const trimmed = inputTask.trim();

    if (!trimmed) {
      dispatch(setIsInputInvalid(true));
      return;
    }

    dispatch(setIsInputInvalid(false));
    dispatch(setModalActive(true));
  };

  const onCloseModal = () => {
    dispatch(closeModal());
    setModalContent("deadline");
    setDifficulty(null);
    setIsDateInvalid(false);
  };

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
    isDateInvalid,
    modalContent,
    difficulty,
    onOpenModal,
    onCloseModal,
    handleDateChange,
    handleAddWithDeadline,
    handleAddWithoutDeadline,
    handleBack,
    handleFinalSubmit,
    setDifficulty,
    onOpenConfirmModal,
    onOpenGroupDeleteConfirmModal,
    onCloseConfirmModal,
  };
};

export { useTaskModal };
