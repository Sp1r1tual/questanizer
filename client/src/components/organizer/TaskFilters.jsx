import { useState } from "react";
import { useTranslation } from "react-i18next";

import styles from "./TaskFilters.module.css";

const TaskFilters = ({ onFilterChange }) => {
    const [status, setStatus] = useState("all");
    const [deadline, setDeadline] = useState("all");
    const [difficulty, setDifficulty] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const { t } = useTranslation();

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
                <option value="all">
                    {t("organizer.taskFilters.status.all")}
                </option>
                <option value="completed">
                    {t("organizer.taskFilters.status.completed")}
                </option>
                <option value="active">
                    {t("organizer.taskFilters.status.active")}
                </option>
            </select>

            <select
                id="deadline-select"
                name="deadline"
                value={deadline}
                onChange={handleDeadlineChange}
                className={styles.select}
            >
                <option value="all">
                    {t("organizer.taskFilters.deadline.all")}
                </option>
                <option value="overdue">
                    {t("organizer.taskFilters.deadline.overdue")}
                </option>
                <option value="upcoming">
                    {t("organizer.taskFilters.deadline.upcoming")}
                </option>
                <option value="none">
                    {t("organizer.taskFilters.deadline.none")}
                </option>
            </select>

            <select
                id="difficulty-select"
                name="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                className={styles.select}
            >
                <option value="all">
                    {t("organizer.taskFilters.difficulty.all")}
                </option>
                <option value="easy">
                    {t("organizer.taskFilters.difficulty.easy")}
                </option>
                <option value="medium">
                    {t("organizer.taskFilters.difficulty.medium")}
                </option>
                <option value="hard">
                    {t("organizer.taskFilters.difficulty.hard")}
                </option>
                <option value="critical">
                    {t("organizer.taskFilters.difficulty.critical")}
                </option>
            </select>

            <select
                id="sortBy-select"
                name="sortBy"
                value={sortBy}
                onChange={handleSortByChange}
                className={styles.select}
            >
                <option value="createdAt">
                    {t("organizer.taskFilters.sortBy.createdAt")}
                </option>
                <option value="deadline">
                    {t("organizer.taskFilters.sortBy.deadline")}
                </option>
                <option value="difficulty">
                    {t("organizer.taskFilters.sortBy.difficulty")}
                </option>
            </select>
        </div>
    );
};

export { TaskFilters };
