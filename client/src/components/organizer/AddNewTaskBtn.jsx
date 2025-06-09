import styles from "./AddNewTaskBtn.module.css";

const AddNewTaskBtn = ({ onClick }) => {
    return (
        <button className={styles.addTask} onClick={onClick}>
            Add new task
        </button>
    );
};

export default AddNewTaskBtn;
