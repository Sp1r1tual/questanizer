import Container from "../ui/Container";
import OrganizerHeader from "./OrganizerHeader";
import TaskInput from "./TaskInput";
import AddNewTaskBtn from "./AddNewTaskBtn";
import TaskList from "./TaskList";
import TaskModal from "../modals/TaskModal";
import ConfirmChoiceModal from "../modals/ConfirmChoiceModal";

const TaskManager = (props) => {
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
        onSetDeadline,
        onCloseConfirmModal,
        onConfirmAction,
    } = props;

    const getConfirmModal = () => {
        if (confirmModal.actionType === "delete") {
            return {
                title: "Delete Task",
                message: `Are you sure you want to delete the task "${confirmModal.taskText}"? This action cannot be undone.`,
                confirmText: "Yes",
                cancelText: "No",
            };
        } else if (confirmModal.actionType === "complete") {
            return {
                title: "Complete Task",
                message: `Mark the task "${confirmModal.taskText}" as completed?`,
                confirmText: "Yes",
                cancelText: "No",
            };
        }
        return {};
    };

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
                tasks={tasks}
                onCompleteTask={onCompleteTask}
                onDeleteTask={onDeleteTask}
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
                    {...getConfirmModal()}
                />
            )}
        </Container>
    );
};

export default TaskManager;
