import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useTasks from "../../hooks/tasks/useTasks";
import useTaskFilters from "../../hooks/tasks/useTaskFilters";
import useAuth from "../../hooks/auth/useAuth";

import Container from "../ui/Container";
import OrganizerHeader from "./OrganizerHeader";
import TaskInput from "./TaskInput";
import AddNewTaskBtn from "./AddNewTaskBtn";
import TaskList from "./TaskList";
import TaskModal from "../modals/TaskModal";
import ConfirmChoiceModal from "../modals/ConfirmChoiceModal";
import { fetchTasks } from "../../store/tasks/tasksThunks";

const TasksView = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const {
        tasks,
        inputTask,
        isInputInvalid,
        modalActive,
        deadline,
        confirmModal,
        onInputChange,
        onOpenModal,
        onAddTask,
        onCloseModal,
        onDeleteTask,
        onCompleteTask,
        onGroupDeleteCompleted,
        onGroupDeleteOverdue,
        onSetDeadline,
        onCloseConfirmModal,
        onConfirmAction,
        loading,
    } = useTasks();

    const { getFilteredTasks } = useTaskFilters();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchTasks());
        }
    }, [user, dispatch]);

    const [filters, setFilters] = useState({
        status: "all",
        deadline: "all",
        difficulty: "all",
        sortBy: "createdAt",
    });

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const filteredTasks = getFilteredTasks(tasks, filters);

    return (
        <Container>
            <OrganizerHeader />
            <TaskInput
                value={inputTask}
                onChange={onInputChange}
                isInvalid={isInputInvalid}
            />
            <AddNewTaskBtn onClick={onOpenModal} />
            <TaskList
                tasks={filteredTasks}
                onCompleteTask={onCompleteTask}
                onDeleteTask={onDeleteTask}
                groupDeleteCompleted={onGroupDeleteCompleted}
                groupDeleteOverdue={onGroupDeleteOverdue}
                loading={loading}
                filters={filters}
                onFilterChange={handleFilterChange}
            />
            {modalActive && (
                <TaskModal
                    isOpen={modalActive}
                    onClose={onCloseModal}
                    onSubmit={onAddTask}
                    deadline={deadline}
                    setDeadline={onSetDeadline}
                />
            )}
            {confirmModal.isOpen && (
                <ConfirmChoiceModal
                    isOpen={confirmModal.isOpen}
                    onClose={onCloseConfirmModal}
                    onConfirm={onConfirmAction}
                    title={
                        confirmModal.actionType === "delete"
                            ? "Delete Task"
                            : confirmModal.actionType === "complete"
                            ? "Complete Task"
                            : "Confirm deletion"
                    }
                    message={
                        confirmModal.actionType === "delete"
                            ? `Are you sure you want to delete the task "${confirmModal.taskText}"? This action cannot be undone.`
                            : confirmModal.actionType === "complete"
                            ? `Mark the task "${confirmModal.taskText}" as completed?`
                            : confirmModal.actionType ===
                              "group-delete-completed"
                            ? "Are you sure you want to delete all completed tasks?"
                            : "Are you sure you want to delete all overdue tasks?"
                    }
                    confirmText="Yes"
                    cancelText="No"
                />
            )}
        </Container>
    );
};

export default TasksView;
