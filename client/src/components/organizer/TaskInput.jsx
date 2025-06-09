import styles from "./TaskInput.module.css";

const TaskInput = ({ onChange, value, isInvalid }) => {
    const inputChangeHandler = (event) => {
        const newValue = event.target.value;
        onChange(newValue);
    };

    return (
        <input
            type="text"
            className={`${styles.taskInput} ${
                isInvalid ? styles.invalidInput : ""
            }`}
            placeholder="Enter what you plan to do"
            onChange={inputChangeHandler}
            value={value}
        />
    );
};

export default TaskInput;
