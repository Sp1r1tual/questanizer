import { useTranslation } from "react-i18next";

import { useOverdueTasks } from "@/hooks/tasks/useOverdueTasks";

import { Modal } from "../ui/modals/Modal";

import styles from "./ConfirmOverdueTasks.module.css";

const ConfirmOverdueTasks = () => {
  const { showModal, overdueTasks, taskStatuses, handleTaskStatusChange, handleConfirm } =
    useOverdueTasks();

  const { t } = useTranslation();

  return (
    <Modal isOpen={showModal} closeBtn={false}>
      <div className={styles.header}>
        <h2>{t("organizer.confirmOverdueTasks.overdueTasks")}</h2>
        <p>{t("organizer.confirmOverdueTasks.beHonest")}</p>
        <p>{t("organizer.confirmOverdueTasks.checkIfCompleted")}</p>
      </div>

      <div className={styles.tasksList}>
        {overdueTasks.map((task) => (
          <div key={task._id} className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <span className={styles.taskText}>{task.text}</span>
              <span className={styles.taskDeadline}>
                {t("shared.deadline")} {new Date(task.deadline).toLocaleDateString("uk-UA")}
              </span>
            </div>

            <div className={styles.taskActions}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`task-${task._id}`}
                  value="completed"
                  checked={taskStatuses[task._id] === true}
                  onChange={() => handleTaskStatusChange(task._id, true)}
                />
                {t("shared.completed")}
              </label>

              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`task-${task._id}`}
                  value="not-completed"
                  checked={taskStatuses[task._id] === false}
                  onChange={() => handleTaskStatusChange(task._id, false)}
                />
                {t("shared.notCompleted")}
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          {t("shared.confirm")}
        </button>
      </div>
    </Modal>
  );
};

export { ConfirmOverdueTasks };
