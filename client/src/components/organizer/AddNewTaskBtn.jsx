import styles from "./AddNewTaskBtn.module.css";

const AddNewTaskBtn = ({ onClick, disabled = false }) => {
    return (
        <button
            className={`${styles.addTask} ${disabled ? styles.disabled : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className={styles.icon}>+</span>
            <span className={styles.text}>Add New Task</span>
        </button>
    );
};

export default AddNewTaskBtn;
