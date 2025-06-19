import styles from "./TaskInput.module.css";

const TaskInput = ({ onChange, value, isInvalid }) => {
    const inputChangeHandler = (event) => {
        const newValue = event.target.value;
        onChange(newValue);
    };

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                className={`${styles.taskInput} ${
                    isInvalid ? styles.invalidInput : ""
                }`}
                placeholder="Enter what you plan to do..."
                onChange={inputChangeHandler}
                value={value}
            />
            {isInvalid && (
                <div className={styles.errorMessage}>
                    Please enter a task description
                </div>
            )}
        </div>
    );
};

export default TaskInput;
