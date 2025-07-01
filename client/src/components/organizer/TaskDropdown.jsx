import styles from "./TaskDropdown.module.css";

const TaskDropdown = ({
    task,
    onComplete,
    onDelete,
    onClose,
    deadlinePassed,
}) => {
    const handleCompleteClick = () => {
        if (!task.isCompleted) {
            onComplete(task._id);
        }
        onClose();
    };

    const handleDeleteClick = () => {
        onDelete(task._id);
        onClose();
    };

    return (
        <>
            <div
                className={styles.dropdownOverlay}
                onClick={onClose}
                data-testid="dropdown-overlay"
            />
            <div className={styles.dropdown}>
                <div className={styles.dropdownInfo}>
                    <div className={styles.infoItem}>
                        📅 Created: {task.createdAt}
                    </div>
                    <div className={styles.infoItem}>
                        ⚔️ Difficulty: {task.difficulty}
                    </div>
                    {task.deadline && (
                        <div className={styles.infoItem}>
                            ⏰ Deadline: {task.deadline}
                        </div>
                    )}
                </div>
                <div className={styles.dropdownActions}>
                    <button
                        className={`${styles.dropdownButton} ${
                            task.isCompleted
                                ? styles.completedBtn
                                : styles.incompleteBtn
                        }`}
                        onClick={handleCompleteClick}
                        disabled={deadlinePassed || task.isCompleted}
                    >
                        {task.isCompleted ? "Completed" : "Mark as Done"}
                    </button>
                    <button
                        className={`${styles.dropdownButton} ${styles.deleteBtn}`}
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </>
    );
};

export default TaskDropdown;
