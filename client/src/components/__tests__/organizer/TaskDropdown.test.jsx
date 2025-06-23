import { render, screen, fireEvent } from "@testing-library/react";
import TaskDropdown from "../../organizer/TaskDropdown";

const mockTask = {
    id: "123",
    text: "Test task",
    isCompleted: false,
    createdAt: "2025-06-01",
    difficulty: "Easy",
    deadline: "2099-12-31",
};

describe("TaskDropdown", () => {
    it("renders task info correctly", () => {
        render(
            <TaskDropdown
                task={mockTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
                onClose={jest.fn()}
                deadlinePassed={false}
            />
        );

        expect(screen.getByText(/Created: 2025-06-01/)).toBeInTheDocument();
        expect(screen.getByText(/Difficulty: Easy/)).toBeInTheDocument();
        expect(screen.getByText(/Deadline: 2099-12-31/)).toBeInTheDocument();
        expect(screen.getByText("Mark as Done")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

    it("calls onClose when overlay is clicked", () => {
        const onCloseMock = jest.fn();

        render(
            <TaskDropdown
                task={mockTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
                onClose={onCloseMock}
                deadlinePassed={false}
            />
        );

        fireEvent.click(screen.getByTestId("dropdown-overlay"));

        expect(onCloseMock).toHaveBeenCalled();
    });

    it("calls onDelete and onClose when Delete is clicked", () => {
        const onDeleteMock = jest.fn();
        const onCloseMock = jest.fn();

        render(
            <TaskDropdown
                task={mockTask}
                onDelete={onDeleteMock}
                onComplete={jest.fn()}
                onClose={onCloseMock}
                deadlinePassed={false}
            />
        );

        fireEvent.click(screen.getByText("Delete"));

        expect(onDeleteMock).toHaveBeenCalledWith("123");
        expect(onCloseMock).toHaveBeenCalled();
    });

    it("calls onComplete and onClose when Mark as Done is clicked", () => {
        const onCompleteMock = jest.fn();
        const onCloseMock = jest.fn();

        render(
            <TaskDropdown
                task={mockTask}
                onDelete={jest.fn()}
                onComplete={onCompleteMock}
                onClose={onCloseMock}
                deadlinePassed={false}
            />
        );

        fireEvent.click(screen.getByText("Mark as Done"));

        expect(onCompleteMock).toHaveBeenCalledWith("123");
        expect(onCloseMock).toHaveBeenCalled();
    });

    it("disables 'Mark as Done' if task is completed", () => {
        const completedTask = { ...mockTask, isCompleted: true };

        render(
            <TaskDropdown
                task={completedTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
                onClose={jest.fn()}
                deadlinePassed={false}
            />
        );

        const button = screen.getByText("Completed");

        expect(button).toBeDisabled();
    });

    it("disables 'Mark as Done' if deadline has passed", () => {
        render(
            <TaskDropdown
                task={mockTask}
                onDelete={jest.fn()}
                onComplete={jest.fn()}
                onClose={jest.fn()}
                deadlinePassed={true}
            />
        );

        const button = screen.getByText("Mark as Done");

        expect(button).toBeDisabled();
    });
});
