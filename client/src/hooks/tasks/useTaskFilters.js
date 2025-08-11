const useTaskFilters = () => {
    const getFilteredTasks = (tasks, filters) => {
        let filtered = [...tasks];

        const now = new Date();

        if (filters.status !== "all") {
            filtered = filtered.filter((task) =>
                filters.status === "completed"
                    ? task.isCompleted
                    : !task.isCompleted
            );
        }

        if (filters.deadline === "overdue") {
            return filtered.filter(
                (task) =>
                    task.deadline &&
                    new Date(task.deadline) < now &&
                    !task.isCompleted
            );
        }

        if (filters.deadline === "upcoming") {
            return filtered.filter(
                (task) =>
                    task.deadline &&
                    new Date(task.deadline) >= now &&
                    !task.isCompleted
            );
        }

        if (filters.deadline === "none") {
            return filtered.filter((task) => !task.deadline);
        }

        if (filters.difficulty !== "all") {
            filtered = filtered.filter(
                (task) => task.difficulty === filters.difficulty
            );
        }

        switch (filters.sortBy) {
            case "createdAt":
                filtered.sort(
                    (taskA, taskB) =>
                        new Date(taskB.createdAt) - new Date(taskA.createdAt)
                );
                break;
            case "deadline":
                filtered.sort(
                    (taskA, taskB) =>
                        new Date(taskA.deadline || 0) -
                        new Date(taskB.deadline || 0)
                );
                break;
            case "difficulty":
                const order = { easy: 1, medium: 2, hard: 3, critical: 4 };

                filtered.sort(
                    (taskA, taskB) =>
                        (order[taskA.difficulty] || 0) -
                        (order[taskB.difficulty] || 0)
                );
                break;
            default:
                break;
        }

        return filtered;
    };

    return { getFilteredTasks };
};

export { useTaskFilters };
