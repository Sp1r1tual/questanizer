import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TaskDropdown from "./TaskDropdown";
import { deleteTaskAsync } from "../../store/tasks/tasksSlice";

import styles from "./TaskItem.module.css";

const TaskItem = ({ task, onDelete, onComplete }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.tasks);

    const now = new Date();
    const deadlineDate = task.deadline ? new Date(task.deadline) : null;
    const isOverdue = deadlineDate && !task.isCompleted && deadlineDate < now;

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handleGroupDeleteCompleted = () => {
        tasks
            .filter((t) => t.isCompleted)
            .forEach((t) => dispatch(deleteTaskAsync(t._id)));
    };

    const handleGroupDeleteOverdue = () => {
        tasks
            .filter(
                (t) =>
                    !t.isCompleted &&
                    t.deadline &&
                    new Date(t.deadline) < new Date()
            )
            .forEach((t) => dispatch(deleteTaskAsync(t._id)));
    };

    return (
        <div
            className={`${styles.taskItem} ${
                task.isCompleted ? styles.completed : ""
            } ${isOverdue ? styles.deadlinePassed : ""}`}
        >
            <div className={styles.taskHeader}>
                <div className={styles.taskContent}>
                    <span className={styles.taskText}>{task.text}</span>
                    {task.deadline && (
                        <div className={styles.deadlineInfo}>
                            ⏰ Deadline:{" "}
                            {deadlineDate.toLocaleDateString("uk-UA")}
                            {isOverdue && (
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
                            tasks={tasks}
                            onComplete={onComplete}
                            onDelete={onDelete}
                            onClose={closeDropdown}
                            isOverdue={isOverdue}
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
                        ⏰ {deadlineDate.toLocaleDateString("uk-UA")}
                    </span>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
