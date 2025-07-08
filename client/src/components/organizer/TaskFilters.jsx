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
            <select
                name="status"
                value={status}
                onChange={handleStatusChange}
                className={styles.select}
            >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
            </select>

            <select
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

            <select
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

            <select
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

export default TaskFilters;
