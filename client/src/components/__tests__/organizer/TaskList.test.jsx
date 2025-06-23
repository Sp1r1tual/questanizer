import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "../../organizer/TaskList";

const mockTasks = [
    {
        id: "1",
        text: "Task 1",
        isCompleted: false,
        createdAt: "2025-06-01",
        difficulty: "Easy",
        deadline: "2099-12-31",
    },
    {
        id: "2",
        text: "Task 2",
        isCompleted: false,
        createdAt: "2025-06-02",
        difficulty: "Medium",
        deadline: "2099-12-31",
    },
];

describe("TaskList", () => {
    it("renders list of tasks", () => {
        render(
            <TaskList
                tasks={mockTasks}
                onDeleteTask={jest.fn()}
                onCompleteTask={jest.fn()}
            />
        );

        expect(screen.getByText("Task 1")).toBeInTheDocument();
        expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("renders 'No tasks available' when task list is empty", () => {
        render(
            <TaskList
                tasks={[]}
                onDeleteTask={jest.fn()}
                onCompleteTask={jest.fn()}
            />
        );

        expect(screen.getByText("No tasks available")).toBeInTheDocument();
    });

    it("calls onDeleteTask when Delete is clicked", () => {
        const onDeleteMock = jest.fn();

        render(
            <TaskList
                tasks={[mockTasks[0]]}
                onDeleteTask={onDeleteMock}
                onCompleteTask={jest.fn()}
            />
        );

        fireEvent.click(screen.getByLabelText("More actions"));
        fireEvent.click(screen.getByText("Delete"));

        expect(onDeleteMock).toHaveBeenCalledWith("1");
    });

    it("calls onCompleteTask when 'Mark as Done' is clicked", () => {
        const onCompleteMock = jest.fn();

        render(
            <TaskList
                tasks={[mockTasks[0]]}
                onDeleteTask={jest.fn()}
                onCompleteTask={onCompleteMock}
            />
        );

        fireEvent.click(screen.getByLabelText("More actions"));
        fireEvent.click(screen.getByText("Mark as Done"));

        expect(onCompleteMock).toHaveBeenCalledWith("1");
    });
});
