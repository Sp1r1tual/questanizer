import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskDropdown from "../../../components/organizer/TaskDropdown";
import isTaskOverdue from "../../../utils/tasks/isTaskOverdue";
import countCompletedTasks from "../../../utils/tasks/countCompletedTasks";
import countOverdueTasks from "../../../utils/tasks/countOverdueTasks";

jest.mock("../../../utils/tasks/isTaskOverdue");
jest.mock("../../../utils/tasks/countCompletedTasks");
jest.mock("../../../utils/tasks/countOverdueTasks");

describe("TaskDropdown", () => {
    const baseTask = {
        _id: "task1",
        createdAt: "2023-01-01T00:00:00Z",
        difficulty: "Medium",
        isCompleted: false,
        deadline: "2023-12-31T00:00:00Z",
    };

    const defaultProps = {
        task: baseTask,
        tasks: [],
        onCompleteTask: jest.fn(),
        onDeleteTask: jest.fn(),
        onClose: jest.fn(),
        groupDeleteCompleted: jest.fn(),
        groupDeleteOverdue: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders created date, difficulty and deadline", () => {
        isTaskOverdue.mockReturnValue(false);
        countCompletedTasks.mockReturnValue(0);
        countOverdueTasks.mockReturnValue(0);

        render(<TaskDropdown {...defaultProps} />);

        expect(screen.getByText(/📅 Created:/)).toHaveTextContent("01.01.2023");
        expect(screen.getByText(/⚔️ Difficulty:/)).toHaveTextContent("Medium");
        expect(screen.getByText(/⏰ Deadline:/)).toHaveTextContent(
            "31.12.2023"
        );
    });

    it("marks task as done only if not completed and not overdue", () => {
        isTaskOverdue.mockReturnValue(false);
        countCompletedTasks.mockReturnValue(0);
        countOverdueTasks.mockReturnValue(0);

        render(<TaskDropdown {...defaultProps} />);

        const doneBtn = screen.getByTestId("done-button");

        expect(doneBtn).toBeEnabled();

        fireEvent.click(doneBtn);

        expect(defaultProps.onCompleteTask).toHaveBeenCalledWith(baseTask._id);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("disables 'Mark as Done' button if task is completed", () => {
        isTaskOverdue.mockReturnValue(false);
        countCompletedTasks.mockReturnValue(3);
        countOverdueTasks.mockReturnValue(0);

        render(
            <TaskDropdown
                {...defaultProps}
                task={{ ...baseTask, isCompleted: true }}
            />
        );

        const doneBtn = screen.getByTestId("done-button");

        expect(doneBtn).toBeDisabled();
        expect(doneBtn).toHaveTextContent(/Completed/i);
    });

    it("disables 'Mark as Done' button if task is overdue", () => {
        isTaskOverdue.mockReturnValue(true);
        countCompletedTasks.mockReturnValue(0);
        countOverdueTasks.mockReturnValue(3);

        render(<TaskDropdown {...defaultProps} />);

        const doneBtn = screen.getByTestId("done-button");

        expect(doneBtn).toBeDisabled();
        expect(doneBtn).toHaveTextContent(/Mark as Done/i);
    });

    it("calls onDeleteTask and onClose when Delete button clicked", () => {
        isTaskOverdue.mockReturnValue(false);
        countCompletedTasks.mockReturnValue(0);
        countOverdueTasks.mockReturnValue(0);

        render(<TaskDropdown {...defaultProps} />);

        const deleteBtn = screen.getByTestId("delete-button");

        fireEvent.click(deleteBtn);

        expect(defaultProps.onDeleteTask).toHaveBeenCalledWith(baseTask._id);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("shows bulk delete completed button if task is completed and countCompletedTasks > 2", () => {
        isTaskOverdue.mockReturnValue(false);
        countCompletedTasks.mockReturnValue(3);
        countOverdueTasks.mockReturnValue(0);

        render(
            <TaskDropdown
                {...defaultProps}
                task={{ ...baseTask, isCompleted: true }}
            />
        );

        const bulkDeleteCompletedBtn = screen.getByTestId(
            "bulk-delete-completed-button"
        );

        expect(bulkDeleteCompletedBtn).toBeInTheDocument();

        fireEvent.click(bulkDeleteCompletedBtn);

        expect(defaultProps.groupDeleteCompleted).toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("shows bulk delete overdue button if task is overdue and countOverdueTasks > 2", () => {
        isTaskOverdue.mockReturnValue(true);
        countCompletedTasks.mockReturnValue(0);
        countOverdueTasks.mockReturnValue(3);

        render(<TaskDropdown {...defaultProps} />);

        const bulkDeleteOverdueBtn = screen.getByTestId(
            "bulk-delete-overdue-button"
        );

        expect(bulkDeleteOverdueBtn).toBeInTheDocument();

        fireEvent.click(bulkDeleteOverdueBtn);

        expect(defaultProps.groupDeleteOverdue).toHaveBeenCalled();
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("closes dropdown when clicking outside (overlay)", () => {
        isTaskOverdue.mockReturnValue(false);
        countCompletedTasks.mockReturnValue(0);
        countOverdueTasks.mockReturnValue(0);

        render(<TaskDropdown {...defaultProps} />);

        const overlay = screen.getByTestId("dropdown-overlay");

        fireEvent.click(overlay);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
