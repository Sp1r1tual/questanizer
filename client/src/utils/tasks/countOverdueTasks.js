import { isTaskOverdue } from "./isTaskOverdue";

const countOverdueTasks = (tasks) => tasks.filter((t) => isTaskOverdue(t)).length;

export { countOverdueTasks };
