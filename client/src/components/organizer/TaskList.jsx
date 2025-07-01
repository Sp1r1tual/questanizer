import TaskItem from "./TaskItem";

import styles from "./TaskList.module.css";

const TaskList = ({ tasks, onDeleteTask, onCompleteTask }) => {
    return (
        <ul className={styles.taskList}>
            {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => {
                    return (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onDelete={() => onDeleteTask(task._id)}
                            onComplete={() => onCompleteTask(task._id)}
                        />
                    );
                })
            ) : (
                <li>No tasks available</li>
            )}
        </ul>
    );
};

export default TaskList;
