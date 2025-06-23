import { render, screen, fireEvent } from "@testing-library/react";
import TasksView from "../../organizer/TasksView";

jest.mock("../../../hooks/tasks/useTasks", () => ({
    useTasks: jest.fn(),
}));

jest.mock("../../organizer/OrganizerHeader", () => () => (
    <div data-testid="organizer-header" />
));
jest.mock("../../organizer/TaskInput", () => (props) => (
    <input
        data-testid="task-input"
        value={props.value}
        onChange={(e) => props.onChange(e)}
    />
));
jest.mock("../../organizer/AddNewTaskBtn", () => (props) => (
    <button onClick={props.onClick}>Add Task</button>
));
jest.mock("../../organizer/TaskList", () => () => (
    <div data-testid="task-list" />
));

jest.mock("../../../components/modals/TaskModal", () => () => (
    <div data-testid="task-modal" />
));
jest.mock("../../../components/modals/ConfirmChoiceModal", () => () => (
    <div data-testid="confirm-modal" />
));
jest.mock("../../../components/ui/Container", () => (props) => (
    <div>{props.children}</div>
));

const mockUseTasks = require("../../../hooks/tasks/useTasks").useTasks;

describe("TasksView", () => {
    const baseState = {
        tasks: [],
        inputTask: "Test Task",
        isInputInvalid: false,
        modalActive: false,
        deadline: "",
        confirmModal: { isOpen: false, actionType: "", taskText: "" },
        onInputChange: jest.fn(),
        onOpenModal: jest.fn(),
        onAddTask: jest.fn(),
        onCloseModal: jest.fn(),
        onDeleteTask: jest.fn(),
        onCompleteTask: jest.fn(),
        onSetDeadline: jest.fn(),
        onCloseConfirmModal: jest.fn(),
        onConfirmAction: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders basic components", () => {
        mockUseTasks.mockReturnValue(baseState);

        render(<TasksView />);

        expect(screen.getByTestId("organizer-header")).toBeInTheDocument();
        expect(screen.getByTestId("task-input")).toBeInTheDocument();
        expect(screen.getByText("Add Task")).toBeInTheDocument();
        expect(screen.getByTestId("task-list")).toBeInTheDocument();
    });

    it("opens TaskModal if modalActive = true", () => {
        mockUseTasks.mockReturnValue({
            ...baseState,
            modalActive: true,
        });

        render(<TasksView />);

        expect(screen.getByTestId("task-modal")).toBeInTheDocument();
    });

    it("opens ConfirmChoiceModal if confirmModal.isOpen = true", () => {
        mockUseTasks.mockReturnValue({
            ...baseState,
            confirmModal: {
                isOpen: true,
                actionType: "delete",
                taskText: "Some Task",
            },
        });

        render(<TasksView />);

        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    });

    it("calls onOpenModal when clicking on Add Task", () => {
        const onOpenModal = jest.fn();
        mockUseTasks.mockReturnValue({
            ...baseState,
            onOpenModal,
        });

        render(<TasksView />);

        fireEvent.click(screen.getByText("Add Task"));

        expect(onOpenModal).toHaveBeenCalled();
    });

    it("calls onInputChange when the text changes", () => {
        const onInputChange = jest.fn();
        mockUseTasks.mockReturnValue({
            ...baseState,
            onInputChange,
        });

        render(<TasksView />);

        fireEvent.change(screen.getByTestId("task-input"), {
            target: { value: "New Value" },
        });

        expect(onInputChange).toHaveBeenCalled();
    });
});
