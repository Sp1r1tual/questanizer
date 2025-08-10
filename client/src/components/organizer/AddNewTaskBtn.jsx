import { useTranslation } from "react-i18next";

import styles from "./AddNewTaskBtn.module.css";

const AddNewTaskBtn = ({ onClick, disabled = false }) => {
    const { t } = useTranslation();
    return (
        <button
            className={`${styles.addTask} ${disabled ? styles.disabled : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className={styles.icon}>+</span>
            <span className={styles.text}>
                {t("organizer.addNewTaskBtn.addTask")}
            </span>
        </button>
    );
};

export { AddNewTaskBtn };
