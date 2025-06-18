import { createContext, useContext } from "react";

const TaskContext = createContext(null);

const useTaskContext = () => {
    const context = useContext(TaskContext);

    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
};

export { TaskContext, useTaskContext };
