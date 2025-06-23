import { useState } from "react";

import TaskDropdown from "./TaskDropdown";

import styles from "./TaskItem.module.css";

const TaskItem = ({ task, onDelete, onComplete }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isDeadlinePassed = () => {
        if (!task.deadline) return false;
        return new Date(task.deadline) < new Date();
    };

    const deadlinePassed = isDeadlinePassed();

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
                        <TaskDropdown
                            task={task}
                            onComplete={onComplete}
                            onDelete={onDelete}
                            onClose={closeDropdown}
                            deadlinePassed={deadlinePassed}
                        />
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
