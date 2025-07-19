import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskList from "../../../components/organizer/TaskList";

const mockTasks = [
    {
        _id: "1",
        text: "Task 1",
        isCompleted: false,
        createdAt: "2025-06-01",
        difficulty: "Easy",
        deadline: "2099-12-31",
    },
    {
        _id: "2",
        text: "Task 2",
        isCompleted: false,
        createdAt: "2025-06-02",
        difficulty: "Medium",
        deadline: "2099-12-31",
    },
];

const defaultFilters = {
    status: "all",
    deadline: "all",
    difficulty: "all",
    sortBy: "createdAt",
};

describe("TaskList", () => {
    it("renders list of tasks", () => {
        render(
            <TaskList
                tasks={mockTasks}
                onDeleteTask={jest.fn()}
                onCompleteTask={jest.fn()}
                groupDeleteCompleted={jest.fn()}
                groupDeleteOverdue={jest.fn()}
                loading={false}
                filters={defaultFilters}
                onFilterChange={jest.fn()}
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
                groupDeleteCompleted={jest.fn()}
                groupDeleteOverdue={jest.fn()}
                loading={false}
                filters={defaultFilters}
                onFilterChange={jest.fn()}
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
                groupDeleteCompleted={jest.fn()}
                groupDeleteOverdue={jest.fn()}
                loading={false}
                filters={defaultFilters}
                onFilterChange={jest.fn()}
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
                groupDeleteCompleted={jest.fn()}
                groupDeleteOverdue={jest.fn()}
                loading={false}
                filters={defaultFilters}
                onFilterChange={jest.fn()}
            />
        );

        fireEvent.click(screen.getByLabelText("More actions"));
        fireEvent.click(screen.getByText("Mark as Done"));

        expect(onCompleteMock).toHaveBeenCalledWith("1");
    });
});
