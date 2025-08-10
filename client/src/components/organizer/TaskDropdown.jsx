import { useTranslation } from "react-i18next";

import { isTaskOverdue } from "../../utils/tasks/isTaskOverdue";
import { countCompletedTasks } from "../../utils/tasks/countCompletedTasks";
import { countOverdueTasks } from "../../utils/tasks/countOverdueTasks";

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
    const { t } = useTranslation();
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
                        📅 {t("shared.createdAt")}{" "}
                        {new Date(task.createdAt).toLocaleDateString("uk-UA")}
                    </div>
                    <div className={styles.infoItem}>
                        ⚔️ {t("shared.difficulty")}{" "}
                        {t(`shared.${task.difficulty}`)}
                    </div>
                    {task.deadline && (
                        <div className={styles.infoItem}>
                            ⏰ {t("shared.deadline")}{" "}
                            {new Date(task.deadline).toLocaleDateString(
                                "uk-UA"
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.dropdownActions}>
                    <button
                        data-testid="done-button"
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
                        {task.isCompleted
                            ? t("shared.completed")
                            : t("organizer.taskDropdown.markAsDone")}
                    </button>

                    <button
                        data-testid="delete-button"
                        className={`${styles.dropdownButton} ${styles.deleteBtn}`}
                        onClick={() => handleAction(onDeleteTask)}
                    >
                        {t("organizer.taskDropdown.delete")}
                    </button>

                    {task.isCompleted && completedTasksCount >= 2 && (
                        <button
                            data-testid="bulk-delete-completed-button"
                            className={`${styles.dropdownButton} ${styles.bulkDeleteBtn}`}
                            onClick={() => {
                                groupDeleteCompleted();
                                onClose();
                            }}
                        >
                            {t("organizer.taskDropdown.deleteAllCompleted")}
                        </button>
                    )}

                    {overdue && overdueTasksCount >= 2 && (
                        <button
                            data-testid="bulk-delete-overdue-button"
                            className={`${styles.dropdownButton} ${styles.bulkDeleteBtn}`}
                            onClick={() => {
                                groupDeleteOverdue();
                                onClose();
                            }}
                        >
                            {t("organizer.taskDropdown.deleteAllOverdue")}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export { TaskDropdown };
