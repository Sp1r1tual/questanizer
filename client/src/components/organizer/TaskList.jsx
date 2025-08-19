import { useTranslation } from "react-i18next";

import { DotsLoader } from "../ui/loaders/DotsLoader";
import { TaskItem } from "./TaskItem";
import { TaskFilters } from "./TaskFilters";

import styles from "./TaskList.module.css";

const TaskList = ({
  tasks,
  onDeleteTask,
  onCompleteTask,
  groupDeleteCompleted,
  groupDeleteOverdue,
  loading,
  filters,
  onFilterChange,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <DotsLoader />;
  }

  const isFilterApplied =
    filters.status !== "all" ||
    filters.deadline !== "all" ||
    filters.difficulty !== "all" ||
    filters.sortBy !== "createdAt";

  const showFilters = tasks.length >= 5 || isFilterApplied;

  return (
    <>
      {showFilters && <TaskFilters onFilterChange={onFilterChange} />}
      <ul className={styles.taskList}>
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              tasks={tasks}
              onDeleteTask={onDeleteTask}
              onCompleteTask={onCompleteTask}
              onGroupDeleteCompleted={groupDeleteCompleted}
              onGroupDeleteOverdue={groupDeleteOverdue}
            />
          ))
        ) : (
          <li>{t("organizer.taskList.noTasks")}</li>
        )}
      </ul>
    </>
  );
};

export { TaskList };
