import { useState } from "react";

import DeadlineStep from "./DeadlineStep";
import DifficultyStep from "./DifficultyStep";

import styles from "./TaskModal.module.css";

const TaskModal = ({ taskName, deadline, setDeadline, onSubmit, onClose }) => {
    const [isDateInvalid, setIsDateInvalid] = useState(false);
    const [pageModal, setPageModal] = useState("deadline");
    const [difficulty, setDifficulty] = useState(null);

    const validateYear = (dateString) => {
        if (!dateString) return false;

        const selectedYear = new Date(dateString).getFullYear();
        const currentYear = new Date().getFullYear();

        return selectedYear >= currentYear && selectedYear <= 2099;
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;

        setDeadline(newDate);
        setIsDateInvalid(!validateYear(newDate));
    };

    const handleAddWithDeadline = () => {
        if (!deadline || !validateYear(deadline)) {
            setIsDateInvalid(true);
            return;
        }
        setPageModal("difficulty");
    };

    const handleAddWithoutDeadline = () => {
        setPageModal("difficulty");
    };

    const handleBack = () => {
        setPageModal("deadline");
    };

    const handleFinalSubmit = () => {
        if (!difficulty) return;

        onSubmit({ hasDeadline: !!deadline, difficulty });
    };

    return (
        <div className={`${styles.modal} ${styles.active}`} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2>{taskName || "New Task"}</h2>

                    {pageModal === "deadline" && (
                        <DeadlineStep
                            deadline={deadline}
                            isDateInvalid={isDateInvalid}
                            onDateChange={handleDateChange}
                            onAddWithDeadline={handleAddWithDeadline}
                            onAddWithoutDeadline={handleAddWithoutDeadline}
                            onClose={onClose}
                        />
                    )}

                    {pageModal === "difficulty" && (
                        <DifficultyStep
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
