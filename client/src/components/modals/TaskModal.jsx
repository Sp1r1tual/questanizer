import useTaskModalState from "../../hooks/tasks/useTaskModalState";

import DeadlinePage from "./DeadlinePage";
import DifficultyPage from "./DifficultyPage";

import styles from "./TaskModal.module.css";

const TaskModal = ({ deadline, setDeadline, onSubmit, onClose, isOpen }) => {
    const {
        isDateInvalid,
        pageModal,
        difficulty,
        handleDateChange,
        handleAddWithDeadline,
        handleAddWithoutDeadline,
        handleBack,
        handleFinalSubmit,
        setDifficulty,
    } = useTaskModalState({
        initialDeadline: deadline,
        setDeadline,
        onSubmit,
        onClose,
    });

    if (!isOpen) return null;

    const modalTitles = {
        deadline: "Set a deadline",
        difficulty: "Select difficulty",
    };

    return (
        <div className={`${styles.modal} ${styles.active}`} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2>{modalTitles[pageModal]}</h2>

                    {pageModal === "deadline" && (
                        <DeadlinePage
                            deadline={deadline}
                            isDateInvalid={isDateInvalid}
                            onDateChange={handleDateChange}
                            onAddWithDeadline={handleAddWithDeadline}
                            onAddWithoutDeadline={handleAddWithoutDeadline}
                            onClose={onClose}
                        />
                    )}

                    {pageModal === "difficulty" && (
                        <DifficultyPage
                            difficulty={difficulty}
                            onSelectDifficulty={setDifficulty}
                            onBack={handleBack}
                            onConfirm={handleFinalSubmit}
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
