import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { useTaskActions } from "@/hooks/tasks/useTaskActions";

export const useOverdueTasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState({});

  const { handleOverdueConfirm } = useTaskActions();

  const tasks = useSelector((state) => state.tasks.tasks);
  const bossId = useSelector((state) => state.bossBattle.bossId);
  const alreadyRagedTaskIds = useSelector((state) => state.bossBattle.alreadyRagedTaskIds);

  const getOverdueTasks = (tasksList) => {
    const now = new Date();

    return tasksList.filter(
      (task) =>
        !task.isCompleted && task.deadline && new Date(task.deadline) < now && !task.damageTaken,
    );
  };

  useEffect(() => {
    const checkForOverdueTasks = () => {
      const overdueTasksList = getOverdueTasks(tasks);

      if (overdueTasksList.length > 0) {
        setOverdueTasks(overdueTasksList);
        setTaskStatuses(
          overdueTasksList.reduce((acc, task) => {
            acc[task._id] = false;
            return acc;
          }, {}),
        );

        setShowModal(true);
      }
    };

    const interval = setInterval(checkForOverdueTasks, 60000);

    if (tasks.length > 0) checkForOverdueTasks();

    return () => clearInterval(interval);
  }, [tasks]);

  const handleTaskStatusChange = (taskId, isCompleted) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: isCompleted,
    }));
  };

  const handleConfirm = async () => {
    const completedTaskIds = Object.entries(taskStatuses)
      .filter(([_, isCompleted]) => isCompleted)
      .map(([taskId]) => taskId);

    const uncompletedTaskIds = Object.entries(taskStatuses)
      .filter(([_, isCompleted]) => !isCompleted)
      .map(([taskId]) => taskId);

    await handleOverdueConfirm({
      completedTaskIds,
      uncompletedTaskIds,
      bossId,
      alreadyRagedTaskIds,
    });

    setShowModal(false);
    setOverdueTasks([]);
    setTaskStatuses({});
  };

  return {
    showModal,
    overdueTasks,
    taskStatuses,
    handleTaskStatusChange,
    handleConfirm,
  };
};
