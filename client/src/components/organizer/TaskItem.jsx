import { useState } from "react";

import TaskDropdown from "./TaskDropdown";
import isTaskOverdue from "../../utils/tasks/isTaskOverdue";

import styles from "./TaskItem.module.css";

const TaskItem = ({
    task,
    tasks,
    onDeleteTask,
    onCompleteTask,
    onGroupDeleteCompleted,
    onGroupDeleteOverdue,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const overdue = isTaskOverdue(task);
    const deadlineDate = task.deadline ? new Date(task.deadline) : null;

    return (
        <div
            className={`${styles.taskItem} ${
                task.isCompleted ? styles.completed : ""
            } ${overdue ? styles.deadlinePassed : ""}`}
        >
            <div className={styles.taskHeader}>
                <div className={styles.taskContent}>
                    <span className={styles.taskText}>{task.text}</span>
                    {deadlineDate && (
                        <div className={styles.deadlineInfo}>
                            ⏰ Deadline:{" "}
                            {deadlineDate.toLocaleDateString("uk-UA")}
                            {overdue && (
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
                        onClick={() => setIsDropdownOpen((open) => !open)}
                        aria-label="More actions"
                    >
                        ⋯
                    </button>
                    {isDropdownOpen && (
                        <TaskDropdown
                            task={task}
                            tasks={tasks}
                            onCompleteTask={onCompleteTask}
                            onDeleteTask={onDeleteTask}
                            onClose={() => setIsDropdownOpen(false)}
                            groupDeleteCompleted={onGroupDeleteCompleted}
                            groupDeleteOverdue={onGroupDeleteOverdue}
                        />
                    )}
                </div>
            </div>

            <div className={styles.taskInfo}>
                <span className={styles.timestamp}>
                    📅 {new Date(task.createdAt).toLocaleDateString("uk-UA")}
                </span>
                <span className={styles.difficulty}>⚔️ {task.difficulty}</span>
                {deadlineDate && (
                    <span className={styles.timestamp}>
                        ⏰ {deadlineDate.toLocaleDateString("uk-UA")}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
