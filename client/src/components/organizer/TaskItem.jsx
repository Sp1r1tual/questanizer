import { useState } from "react";

import styles from "./TaskItem.module.css";

const TaskItem = ({ task, onDelete, onComplete }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isDeadlinePassed = () => {
        if (!task.deadline) return false;

        const deadlineDate = new Date(task.deadline);
        const currentDate = new Date();

        return deadlineDate < currentDate;
    };

    const deadlinePassed = isDeadlinePassed();

    const handleDeleteClick = () => {
        onDelete(task.id);
        setIsDropdownOpen(false);
    };

    const handleCompleteClick = () => {
        if (!task.isCompleted) {
            onComplete(task.id);
        }
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <div
            className={`${styles.taskItem} ${
                task.isCompleted ? styles.completed : ""
            } ${
                deadlinePassed && !task.isCompleted ? styles.deadlinePassed : ""
            }`}
        >
            <div className={styles.taskHeader}>
                <div className={styles.taskContent}>
                    <span className={styles.taskText}>{task.text}</span>
                    {task.deadline && (
                        <div className={styles.deadlineInfo}>
                            ⏰ {task.deadline}
                            {deadlinePassed && !task.isCompleted && (
                                <span className={styles.overdueLabel}>
                                    OVERDUE
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.actionContainer}>
                    <button
                        className={styles.moreButton}
                        onClick={toggleDropdown}
                        aria-label="More actions"
                    >
                        ⋯
                    </button>
                    {isDropdownOpen && (
                        <>
                            <div
                                className={styles.dropdownOverlay}
                                onClick={closeDropdown}
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
                                        disabled={
                                            deadlinePassed || task.isCompleted
                                        }
                                    >
                                        {task.isCompleted
                                            ? "Completed"
                                            : "Mark as Done"}
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
                    )}
                </div>
            </div>

            <div className={styles.taskInfo}>
                <span className={styles.timestamp}>📅 {task.createdAt}</span>
                <span className={styles.difficulty}>⚔️ {task.difficulty}</span>
                {task.deadline && (
                    <span className={styles.timestamp}>⏰ {task.deadline}</span>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
