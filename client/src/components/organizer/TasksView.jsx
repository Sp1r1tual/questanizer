import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { useTasks } from "@/hooks/tasks/useTasks";
import { useTaskFilters } from "@/hooks/tasks/useTaskFilters";
import { useConfirmModalTexts } from "@/hooks/tasks/useConfirmModalTexts";
import { useAuth } from "@/hooks/auth/useAuth";
import { useTaskModal } from "@/hooks/tasks/useTaskModal";

import { Modal } from "../ui/modals/Modal";
import { Container } from "../ui/wrappers/Container";
import { OrganizerHeader } from "./OrganizerHeader";
import { TaskInput } from "./TaskInput";
import { AddNewTaskBtn } from "./AddNewTaskBtn";
import { TaskList } from "./TaskList";
import { DeadlineContent } from "./DeadlineContent";
import { DifficultyContent } from "./DifficultyContent";
import { ConfirmChoiceModal } from "../ui/modals/ConfirmChoiceModal";

import { fetchTasks } from "@/store/tasks/tasksThunks";

import styles from "./TaskView.module.css";

const TasksView = () => {
  const dispatch = useDispatch();

  const { user } = useAuth();

  const {
    tasks,
    inputTask,
    isInputInvalid,
    modalActive,
    deadline,
    confirmModal,
    onInputChange,
    onOpenModal,
    onAddTask,
    onCloseModal,
    onDeleteTask,
    onCompleteTask,
    onGroupDeleteCompleted,
    onGroupDeleteOverdue,
    onSetDeadline,
    onCloseConfirmModal,
    onConfirmAction,
    loading,
  } = useTasks();

  const { getFilteredTasks } = useTaskFilters();

  const { t } = useTranslation();

  const { title, message } = useConfirmModalTexts(confirmModal, t);

  const {
    isDateInvalid,
    modalContent,
    difficulty,
    handleDateChange,
    handleAddWithDeadline,
    handleAddWithoutDeadline,
    handleBack,
    handleFinalSubmit,
    setDifficulty,
  } = useTaskModal({
    deadline,
    setDeadline: onSetDeadline,
    onSubmit: onAddTask,
    onClose: onCloseModal,
  });

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks());
    }
  }, [user, dispatch]);

  const [filters, setFilters] = useState({
    status: "all",
    deadline: "all",
    difficulty: "all",
    sortBy: "createdAt",
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredTasks = getFilteredTasks(tasks, filters);

  const modalTitles = {
    deadline: t("organizer.organizerModal.setDeadline"),
    difficulty: t("organizer.organizerModal.setDifficulty"),
  };

  return (
    <Container>
      <OrganizerHeader />
      <TaskInput value={inputTask} onChange={onInputChange} isInvalid={isInputInvalid} />
      <AddNewTaskBtn onClick={onOpenModal} />
      <TaskList
        tasks={filteredTasks}
        onCompleteTask={onCompleteTask}
        onDeleteTask={onDeleteTask}
        groupDeleteCompleted={onGroupDeleteCompleted}
        groupDeleteOverdue={onGroupDeleteOverdue}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {modalActive && (
        <Modal isOpen={modalActive} onClose={onCloseModal}>
          <form onSubmit={(event) => event.preventDefault()} className={styles.taskModal}>
            <h2 className={styles.taskModalTitle}>{modalTitles[modalContent]}</h2>

            <div className={styles.taskModalHidden}>
              {modalContent === "deadline"
                ? t("organizer.organizerModal.selectDeadline")
                : t("organizer.organizerModal.selectDifficulty")}
            </div>
            {modalContent === "deadline" && (
              <DeadlineContent
                deadline={deadline}
                isDateInvalid={isDateInvalid}
                onDateChange={handleDateChange}
                onAddWithDeadline={handleAddWithDeadline}
                onAddWithoutDeadline={handleAddWithoutDeadline}
                onClose={onCloseModal}
              />
            )}
            {modalContent === "difficulty" && (
              <DifficultyContent
                difficulty={difficulty}
                onSelectDifficulty={setDifficulty}
                onBack={handleBack}
                onConfirm={handleFinalSubmit}
              />
            )}
          </form>
        </Modal>
      )}

      {confirmModal.isOpen && (
        <ConfirmChoiceModal
          isOpen={confirmModal.isOpen}
          onClose={onCloseConfirmModal}
          onConfirm={onConfirmAction}
          title={title}
          message={message}
          confirmText={t("shared.yes")}
          cancelText={t("shared.no")}
        />
      )}
    </Container>
  );
};

export { TasksView };
