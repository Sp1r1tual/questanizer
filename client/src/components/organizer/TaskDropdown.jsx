import styles from "./TaskDropdown.module.css";

const TaskDropdown = ({
    task,
    tasks,
    onComplete,
    onDelete,
    onClose,
    isOverdue,
    groupDeleteCompleted,
    groupDeleteOverdue,
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

    const completedTasksCount = tasks.filter((t) => t.isCompleted).length;
    const overdueTasksCount = tasks.filter(
        (t) => !t.isCompleted && t.deadline && new Date(t.deadline) < new Date()
    ).length;

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
                        📅 Created:{" "}
                        {new Date(task.createdAt).toLocaleDateString("uk-UA")}
                    </div>
                    <div className={styles.infoItem}>
                        ⚔️ Difficulty: {task.difficulty}
                    </div>
                    {task.deadline && (
                        <div className={styles.infoItem}>
                            ⏰ Deadline:{" "}
                            {new Date(task.deadline).toLocaleDateString(
                                "uk-UA"
                            )}
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
                        disabled={task.isCompleted || isOverdue}
                    >
                        {task.isCompleted ? "Completed" : "Mark as Done"}
                    </button>
                    <button
                        className={`${styles.dropdownButton} ${styles.deleteBtn}`}
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </button>
                    {task.isCompleted && completedTasksCount > 2 && (
                        <button
                            className={`${styles.dropdownButton} ${styles.bulkDeleteBtn}`}
                            onClick={() => {
                                groupDeleteCompleted();
                                onClose();
                            }}
                        >
                            Delete all completed tasks
                        </button>
                    )}
                    {isOverdue && overdueTasksCount > 2 && (
                        <button
                            className={`${styles.dropdownButton} ${styles.bulkDeleteBtn}`}
                            onClick={() => {
                                groupDeleteOverdue();
                                onClose();
                            }}
                        >
                            Delete all overdue tasks
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskDropdown;
