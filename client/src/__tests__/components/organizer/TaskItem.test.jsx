import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "../../../components/organizer/TaskItem";

jest.mock("../../../components/organizer/TaskDropdown", () => (props) => (
    <div data-testid="mock-dropdown">
        MockDropdown - {props.task.text}
        <button onClick={() => props.onCompleteTask(props.task.id)}>
            Complete
        </button>
        <button onClick={() => props.onDeleteTask(props.task.id)}>
            Delete
        </button>
        <button onClick={props.onClose}>Close</button>
    </div>
));

describe("TaskItem", () => {
    const baseTask = {
        id: "1",
        text: "Test Task",
        createdAt: "2025-06-01T00:00:00Z",
        difficulty: "Medium",
        deadline: "2025-06-15T00:00:00Z",
        isCompleted: false,
    };

    it("renders task text", () => {
        render(
            <TaskItem
                task={baseTask}
                onDeleteTask={() => {}}
                onCompleteTask={() => {}}
            />
        );

        expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    it("shows dropdown when button clicked", () => {
        render(
            <TaskItem
                task={baseTask}
                onDeleteTask={() => {}}
                onCompleteTask={() => {}}
            />
        );

        const button = screen.getByRole("button");

        fireEvent.click(button);

        expect(screen.getByTestId("mock-dropdown")).toBeInTheDocument();
    });

    it("calls onCompleteTask when Complete clicked", () => {
        const handleComplete = jest.fn();

        render(
            <TaskItem
                task={baseTask}
                onDeleteTask={() => {}}
                onCompleteTask={handleComplete}
            />
        );

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByText("Complete"));

        expect(handleComplete).toHaveBeenCalledWith("1");
    });

    it("calls onDeleteTask when Delete clicked", () => {
        const handleDelete = jest.fn();

        render(
            <TaskItem
                task={baseTask}
                onDeleteTask={handleDelete}
                onCompleteTask={() => {}}
            />
        );

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByText("Delete"));

        expect(handleDelete).toHaveBeenCalledWith("1");
    });

    it("hides dropdown when Close clicked", () => {
        render(
            <TaskItem
                task={baseTask}
                onDeleteTask={() => {}}
                onCompleteTask={() => {}}
            />
        );

        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByTestId("mock-dropdown")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Close"));
        expect(screen.queryByTestId("mock-dropdown")).not.toBeInTheDocument();
    });
});
