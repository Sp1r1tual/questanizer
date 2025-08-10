import { useTranslation } from "react-i18next";

import styles from "./TaskInput.module.css";

const TaskInput = ({ onChange, value, isInvalid }) => {
    const { t } = useTranslation();

    const inputChangeHandler = (event) => {
        const newValue = event.target.value;

        onChange(newValue);
    };

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                id="taskInput"
                name="task"
                className={`${styles.taskInput} ${
                    isInvalid ? styles.invalidInput : ""
                }`}
                placeholder={t("organizer.taskInput.placeholder")}
                onChange={inputChangeHandler}
                value={value}
            />
            {isInvalid && (
                <div className={styles.errorMessage}>
                    {t("organizer.taskInput.error")}
                </div>
            )}
        </div>
    );
};

export { TaskInput };
