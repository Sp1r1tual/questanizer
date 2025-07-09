const countCompletedTasks = (tasks) =>
    tasks.filter((t) => t.isCompleted).length;

export default countCompletedTasks;
