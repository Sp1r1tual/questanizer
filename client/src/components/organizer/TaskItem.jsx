import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TaskDropdown from "./TaskDropdown";
import { deleteTaskAsync } from "../../store/tasks/tasksSlice";

import styles from "./TaskItem.module.css";

const TaskItem = ({ task, onDelete, onComplete }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);

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

    const handleGroupDeleteCompleted = () => {
        tasks
            .filter((task) => task.isCompleted)
            .forEach((task) => dispatch(deleteTaskAsync(task._id)));
    };

    const handleGroupDeleteOverdue = () => {
        tasks
            .filter(
                (task) =>
                    !task.isCompleted &&
                    task.deadline &&
                    new Date(task.deadline) < new Date()
            )
            .forEach((task) => dispatch(deleteTaskAsync(task._id)));
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
                            ⏰ Deadline:{" "}
                            {new Date(task.deadline).toLocaleDateString(
                                "uk-UA"
                            )}
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
                            groupDeleteCompleted={handleGroupDeleteCompleted}
                            groupDeleteOverdue={handleGroupDeleteOverdue}
                        />
                    )}
                </div>
            </div>

            <div className={styles.taskInfo}>
                <span className={styles.timestamp}>
                    📅 {new Date(task.createdAt).toLocaleDateString("uk-UA")}
                </span>
                <span className={styles.difficulty}>⚔️ {task.difficulty}</span>
                {task.deadline && (
                    <span className={styles.timestamp}>
                        ⏰ {new Date(task.deadline).toLocaleDateString("uk-UA")}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
