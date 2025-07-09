const isTaskOverdue = (task) => {
    if (!task.deadline || task.isCompleted) return false;

    return new Date(task.deadline) < new Date();
};

export default isTaskOverdue;
