import styles from "./DeadlinePage.module.css";

const DeadlinePage = ({
    deadline,
    isDateInvalid,
    onDateChange,
    onAddWithDeadline,
    onAddWithoutDeadline,
    onClose,
}) => {
    return (
        <>
            <input
                type="date"
                value={deadline || ""}
                onChange={onDateChange}
                className={`${styles.dateInput} ${
                    isDateInvalid ? styles.invalidInput : ""
                }`}
                placeholder="dd/mm/yyyy"
            />
            {isDateInvalid && deadline && (
                <p className={styles.error}>
                    Please select a year between {new Date().getFullYear()} and
                    2099
                </p>
            )}
            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    className={styles.addWithDeadlineBtn}
                    onClick={onAddWithDeadline}
                >
                    Add with deadline
                </button>
                <button
                    type="button"
                    className={styles.addWithoutDeadlineBtn}
                    onClick={onAddWithoutDeadline}
                >
                    Add without deadline
                </button>
                <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </>
    );
};

export default DeadlinePage;
