import Container from "../ui/Container";
import OrganizerHeader from "./OrganizerHeader";
import TaskInput from "./TaskInput";
import AddNewTaskBtn from "./AddNewTaskBtn";
import TaskList from "./TaskList";
import TaskModal from "../modals/TaskModal";

const TaskManager = (props) => {
    const {
        tasks,
        inputTask,
        isInputInvalid,
        modalActive,
        deadline,
        onInputChange,
        onOpenModal,
        onAddTask,
        onCloseModal,
        onDeleteTask,
        onCompleteTask,
        onSetDeadline,
    } = props;

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
        </Container>
    );
};

export default TaskManager;
