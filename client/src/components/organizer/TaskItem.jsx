import styles from "./TaskItem.module.css";

const TaskItem = ({ task, onDelete, onComplete }) => {
    const isDeadlinePassed = () => {
        if (!task.deadline) return false;

        const deadlineDate = new Date(task.deadline);
        const currentDate = new Date();

        return deadlineDate < currentDate;
    };

    const deadlinePassed = isDeadlinePassed();

    const handleDeleteClick = () => {
        onDelete(task.id);
    };

    const handleCompleteClick = () => {
        if (!task.isCompleted) {
            onComplete(task.id);
        }
    };

    return (
        <>
            <div
                className={`${styles.taskItem} ${
                    task.isCompleted ? styles.completed : ""
                } ${
                    deadlinePassed && !task.isCompleted
                        ? styles.deadlinePassed
                        : ""
                }`}
            >
                <span className={styles.taskText}>{task.text}</span>
                <div className={styles.taskContent}>
                    <span className={styles.timestamp}>
                        📅 Created: {task.createdAt}
                    </span>
                    <span className={styles.difficulty}>
                        ⚔️ Difficulty: {task.difficulty}
                    </span>
                    {task.deadline && (
                        <span className={styles.timestamp}>
                            ⏰ Deadline: {task.deadline}
                        </span>
                    )}
                    <div className={styles.buttonContainer}>
                        <button
                            className={`${styles.button} ${
                                task.isCompleted
                                    ? styles.completedBtn
                                    : styles.incompleteBtn
                            }`}
                            onClick={handleCompleteClick}
                            disabled={deadlinePassed}
                        >
                            Done
                        </button>
                        <button
                            className={`${styles.button} ${styles.deleteBtn}`}
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskItem;
