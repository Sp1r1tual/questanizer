import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../../organizer/TaskItem";

jest.mock("../../organizer/TaskDropdown", () => (props) => (
    <div data-testid="mock-dropdown">
        MockDropdown - {props.task.text}
        <button onClick={() => props.onComplete(props.task.id)}>
            Complete
        </button>
        <button onClick={() => props.onDelete(props.task.id)}>Delete</button>
        <button onClick={props.onClose}>Close</button>
    </div>
));

const baseTask = {
    id: "t1",
    text: "Test Task",
    isCompleted: false,
    createdAt: "2025-06-01",
    difficulty: "Easy",
    deadline: "2099-12-31",
};

describe("TaskItem", () => {
    it("renders task info correctly", () => {
        render(
            <TaskItem
                task={baseTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
            />
        );

        expect(screen.getByText("Test Task")).toBeInTheDocument();
        expect(screen.getByText("📅 2025-06-01")).toBeInTheDocument();
        expect(screen.getByText("⚔️ Easy")).toBeInTheDocument();
        expect(screen.getAllByText("⏰ 2099-12-31")).toHaveLength(2);
    });

    it("opens and closes dropdown on click", () => {
        render(
            <TaskItem
                task={baseTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
            />
        );

        const moreBtn = screen.getByLabelText("More actions");

        fireEvent.click(moreBtn);
        expect(screen.getByTestId("mock-dropdown")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("mock-dropdown")).not.toBeInTheDocument();
    });

    it("calls onComplete and closes dropdown", () => {
        const onCompleteMock = jest.fn();

        render(
            <TaskItem
                task={baseTask}
                onDelete={jest.fn()}
                onComplete={onCompleteMock}
            />
        );

        fireEvent.click(screen.getByLabelText("More actions"));
        fireEvent.click(screen.getByText("Complete"));

        expect(onCompleteMock).toHaveBeenCalledWith("t1");
    });

    it("calls onDelete and closes dropdown", () => {
        const onDeleteMock = jest.fn();

        render(
            <TaskItem
                task={baseTask}
                onDelete={onDeleteMock}
                onComplete={jest.fn()}
            />
        );

        fireEvent.click(screen.getByLabelText("More actions"));
        fireEvent.click(screen.getByText("Delete"));

        expect(onDeleteMock).toHaveBeenCalledWith("t1");
    });

    it("renders overdue label if deadline has passed", () => {
        const pastTask = {
            ...baseTask,
            deadline: "2000-01-01",
            isCompleted: false,
        };

        render(
            <TaskItem
                task={pastTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
            />
        );

        expect(screen.getByText("OVERDUE")).toBeInTheDocument();
    });

    it("does not render overdue label if task is completed", () => {
        const pastTask = {
            ...baseTask,
            deadline: "2000-01-01",
            isCompleted: true,
        };

        render(
            <TaskItem
                task={pastTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
            />
        );

        expect(screen.queryByText("OVERDUE")).not.toBeInTheDocument();
    });
});
