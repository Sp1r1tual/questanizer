import { useState } from "react";

import styles from "./TaskModal.module.css";

const TaskModal = ({ taskName, deadline, setDeadline, onSubmit, onClose }) => {
    const [isDateInvalid, setIsDateInvalid] = useState(false);

    const validateYear = (dateString) => {
        if (!dateString) return false;
        const selectedDate = new Date(dateString);
        const selectedYear = selectedDate.getFullYear();
        const currentYear = new Date().getFullYear();
        return selectedYear >= currentYear && selectedYear <= 2099;
    };

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setDeadline(newDate);
        const isValid = validateYear(newDate);
        setIsDateInvalid(!isValid);
    };

    const handleAddWithDeadline = () => {
        if (!deadline || !validateYear(deadline)) {
            setIsDateInvalid(true);
            return;
        }
        onSubmit(true);
    };

    return (
        <div className={`${styles.modal} ${styles.active}`} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={(event) => event.stopPropagation()}
            >
                <form onSubmit={(event) => event.preventDefault()}>
                    <h2>{taskName}</h2>
                    <input
                        type="date"
                        value={deadline}
                        onChange={handleDateChange}
                        className={`${styles.dateInput} ${
                            isDateInvalid ? styles.invalidInput : ""
                        }`}
                    />
                    {isDateInvalid && deadline && (
                        <p className={styles.error}>
                            Please select a year between{" "}
                            {new Date().getFullYear()} and 2030
                        </p>
                    )}
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={handleAddWithDeadline}>
                            Add with deadline
                        </button>
                        <button type="button" onClick={() => onSubmit(false)}>
                            Add without deadline
                        </button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
