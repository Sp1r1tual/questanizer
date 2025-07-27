const useTaskFilters = () => {
    const getFilteredTasks = (tasks, filters) => {
        let filtered = [...tasks];

        if (filters.status !== "all") {
            filtered = filtered.filter((task) =>
                filters.status === "completed"
                    ? task.isCompleted
                    : !task.isCompleted
            );
        }

        const now = new Date();

        if (filters.deadline === "overdue") {
            filtered = filtered.filter(
                (task) =>
                    task.deadline &&
                    new Date(task.deadline) < now &&
                    !task.isCompleted
            );
        } else if (filters.deadline === "upcoming") {
            filtered = filtered.filter(
                (task) =>
                    task.deadline &&
                    new Date(task.deadline) >= now &&
                    !task.isCompleted
            );
        } else if (filters.deadline === "none") {
            filtered = filtered.filter((task) => !task.deadline);
        }

        if (filters.difficulty !== "all") {
            filtered = filtered.filter(
                (task) => task.difficulty === filters.difficulty
            );
        }

        if (filters.sortBy === "createdAt") {
            filtered.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else if (filters.sortBy === "deadline") {
            filtered.sort(
                (a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0)
            );
        } else if (filters.sortBy === "difficulty") {
            const order = { easy: 1, medium: 2, hard: 3, critical: 4 };
            filtered.sort(
                (a, b) =>
                    (order[a.difficulty] || 0) - (order[b.difficulty] || 0)
            );
        }

        return filtered;
    };

    return { getFilteredTasks };
};

export { useTaskFilters };
