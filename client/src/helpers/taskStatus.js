const getTaskStatus = (task) => ({
    isCompleted: task.isCompleted,
    isOverdue:
        !!task.deadline &&
        !task.isCompleted &&
        new Date(task.deadline) < new Date(),
});

export default getTaskStatus;
