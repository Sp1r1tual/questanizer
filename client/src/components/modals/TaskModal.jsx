import { useState } from "react";

import DeadlinePage from "./DeadlinePage";
import DifficultyPage from "./DifficultyPage";

import styles from "./TaskModal.module.css";

const TaskModal = ({
    deadline: initialDeadline,
    setDeadline,
    onSubmit,
    onClose,
    isOpen,
}) => {
    const [isDateInvalid, setIsDateInvalid] = useState(false);
    const [pageModal, setPageModal] = useState("deadline");
    const [difficulty, setDifficulty] = useState(null);

    const isDateValid = (dateString) => {
        if (!dateString) return false;

        const selectedYear = new Date(dateString).getFullYear();
        const currentYear = new Date().getFullYear();

        return selectedYear >= currentYear && selectedYear <= 2099;
    };

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setDeadline(newDate);
        setIsDateInvalid(!newDate || !isDateValid(newDate));
    };

    const handleAddWithDeadline = () => {
        if (!initialDeadline || !isDateValid(initialDeadline)) {
            setIsDateInvalid(true);
            return;
        }
        setPageModal("difficulty");
    };

    const handleAddWithoutDeadline = () => {
        setDeadline("");
        setIsDateInvalid(false);
        setPageModal("difficulty");
    };

    const handleBack = () => {
        setPageModal("deadline");
        setDifficulty(null);
    };

    const handleFinalSubmit = () => {
        if (!difficulty) return;
        onSubmit({ hasDeadline: !!initialDeadline, difficulty });
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`${styles.modal} ${styles.active}`} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(event) => event.stopPropagation()}
            >
                <form onSubmit={(event) => event.preventDefault()}>
                    <h2>{"Set a deadline"}</h2>
                    {pageModal === "deadline" && (
                        <DeadlinePage
                            deadline={initialDeadline}
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
