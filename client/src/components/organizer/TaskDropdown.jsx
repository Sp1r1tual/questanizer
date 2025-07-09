import isTaskOverdue from "../../utils/tasks/isTaskOverdue";
import countCompletedTasks from "../../utils/tasks/countCompletedTasks";
import countOverdueTasks from "../../utils/tasks/countOverdueTasks";

import styles from "./TaskDropdown.module.css";

const TaskDropdown = ({
    task,
    tasks,
    onCompleteTask,
    onDeleteTask,
    onClose,
    groupDeleteCompleted,
    groupDeleteOverdue,
}) => {
    const completedTasksCount = countCompletedTasks(tasks);
    const overdueTasksCount = countOverdueTasks(tasks);
    const overdue = isTaskOverdue(task);

    const handleAction = (callback) => {
        callback(task._id);
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
                        onClick={
                            !task.isCompleted && !overdue
                                ? () => handleAction(onCompleteTask)
                                : null
                        }
                        disabled={task.isCompleted || overdue}
                    >
                        {task.isCompleted ? "Completed" : "Mark as Done"}
                    </button>

                    <button
                        className={`${styles.dropdownButton} ${styles.deleteBtn}`}
                        onClick={() => handleAction(onDeleteTask)}
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

                    {overdue && overdueTasksCount > 2 && (
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
