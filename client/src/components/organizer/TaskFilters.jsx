import { useState } from "react";

import styles from "./TaskFilters.module.css";

const TaskFilters = ({ onFilterChange }) => {
    const [status, setStatus] = useState("all");
    const [deadline, setDeadline] = useState("all");
    const [difficulty, setDifficulty] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        onFilterChange({
            status: event.target.value,
            deadline,
            difficulty,
            sortBy,
        });
    };

    const handleDeadlineChange = (event) => {
        setDeadline(event.target.value);
        onFilterChange({
            status,
            deadline: event.target.value,
            difficulty,
            sortBy,
        });
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
        onFilterChange({
            status,
            deadline,
            difficulty: event.target.value,
            sortBy,
        });
    };

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
        onFilterChange({
            status,
            deadline,
            difficulty,
            sortBy: event.target.value,
        });
    };

    return (
        <div className={styles.filtersContainer}>
            <label className={styles.visuallyHidden} htmlFor="status-select">
                Filter tasks by status
            </label>
            <select
                id="status-select"
                name="status"
                value={status}
                onChange={handleStatusChange}
                className={styles.select}
            >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
            </select>

            <label className={styles.visuallyHidden} htmlFor="deadline-select">
                Filter tasks by deadline
            </label>
            <select
                id="deadline-select"
                name="deadline"
                value={deadline}
                onChange={handleDeadlineChange}
                className={styles.select}
            >
                <option value="all">Any deadline</option>
                <option value="overdue">Overdue</option>
                <option value="upcoming">Future</option>
                <option value="none">No deadline</option>
            </select>

            <label
                className={styles.visuallyHidden}
                htmlFor="difficulty-select"
            >
                Filter tasks by difficulty
            </label>
            <select
                id="difficulty-select"
                name="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                className={styles.select}
            >
                <option value="all">Any difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="critical">Critical</option>
            </select>

            <label className={styles.visuallyHidden} htmlFor="sortBy-select">
                Sort tasks by
            </label>
            <select
                id="sortBy-select"
                name="sortBy"
                value={sortBy}
                onChange={handleSortByChange}
                className={styles.select}
            >
                <option value="createdAt">By creation date</option>
                <option value="deadline">By deadline</option>
                <option value="difficulty">By difficulty</option>
            </select>
        </div>
    );
};

export { TaskFilters };
