import { useTasks } from "../../hooks/useTasks";

import { TaskContext } from "../../context/TaskContext";

const TaskProvider = ({ children }) => {
    const taskData = useTasks();

    return (
        <TaskContext.Provider value={taskData}>{children}</TaskContext.Provider>
    );
};

export default TaskProvider;
