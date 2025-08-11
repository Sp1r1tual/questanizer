import { useTaskModalState } from "@/hooks/tasks/useTaskModalState";

import { DeadlinePage } from "./DeadlinePage";
import { DifficultyPage } from "./DifficultyPage";

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
        deadline,
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
        <div
            className={`${styles.modal} ${styles.active}`}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            aria-describedby="task-modal-desc"
        >
            <div
                className={styles.modalContent}
                onClick={(event) => event.stopPropagation()}
            >
                <form onSubmit={(event) => event.preventDefault()}>
                    <h2 id="task-modal-title">{modalTitles[pageModal]}</h2>

                    <div id="task-modal-desc" className="visuallyHidden">
                        {pageModal === "deadline"
                            ? "Select a deadline date for your task."
                            : "Select the difficulty level for your task."}
                    </div>

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

export { TaskModal };
