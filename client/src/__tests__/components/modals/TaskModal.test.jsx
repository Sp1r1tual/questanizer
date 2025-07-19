import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskModal from "../../../components/modals/TaskModal";
import useTaskModalState from "../../../hooks/tasks/useTaskModalState";

jest.mock("../../../hooks/tasks/useTaskModalState", () => jest.fn());

const defaultHookReturn = {
    isDateInvalid: false,
    pageModal: "deadline",
    difficulty: "",
    handleDateChange: jest.fn(),
    handleAddWithDeadline: jest.fn(),
    handleAddWithoutDeadline: jest.fn(),
    handleBack: jest.fn(),
    handleFinalSubmit: jest.fn(),
    setDifficulty: jest.fn(),
};

const mockSetDeadline = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnClose = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

it("renders deadline modal title", () => {
    useTaskModalState.mockReturnValue({
        ...defaultHookReturn,
        pageModal: "deadline",
    });
    render(
        <TaskModal
            isOpen={true}
            deadline="2024-06-01"
            setDeadline={mockSetDeadline}
            onSubmit={mockOnSubmit}
            onClose={mockOnClose}
        />
    );
    expect(screen.getByText("Set a deadline")).toBeInTheDocument();
});

it("renders difficulty modal title", () => {
    useTaskModalState.mockReturnValue({
        ...defaultHookReturn,
        pageModal: "difficulty",
    });
    render(
        <TaskModal
            isOpen={true}
            deadline=""
            setDeadline={mockSetDeadline}
            onSubmit={mockOnSubmit}
            onClose={mockOnClose}
        />
    );
    expect(screen.getByText("Select difficulty")).toBeInTheDocument();
});

it("does not render modal when isOpen is false", () => {
    useTaskModalState.mockReturnValue({
        ...defaultHookReturn,
        pageModal: "deadline",
    });
    render(
        <TaskModal
            isOpen={false}
            deadline=""
            setDeadline={mockSetDeadline}
            onSubmit={mockOnSubmit}
            onClose={mockOnClose}
        />
    );
    expect(screen.queryByText("Set a deadline")).not.toBeInTheDocument();
    expect(screen.queryByText("Select difficulty")).not.toBeInTheDocument();
});

it("calls onClose when backdrop is clicked", () => {
    useTaskModalState.mockReturnValue({
        ...defaultHookReturn,
        pageModal: "deadline",
    });

    const { container } = render(
        <TaskModal
            isOpen={true}
            deadline=""
            setDeadline={mockSetDeadline}
            onSubmit={mockOnSubmit}
            onClose={mockOnClose}
        />
    );

    fireEvent.click(container.firstChild);
    expect(mockOnClose).toHaveBeenCalled();
});

it("does not call onClose when modal content is clicked", () => {
    useTaskModalState.mockReturnValue({
        ...defaultHookReturn,
        pageModal: "deadline",
    });
    render(
        <TaskModal
            isOpen={true}
            deadline=""
            setDeadline={mockSetDeadline}
            onSubmit={mockOnSubmit}
            onClose={mockOnClose}
        />
    );
    fireEvent.click(screen.getByText("Set a deadline"));
    expect(mockOnClose).not.toHaveBeenCalled();
});
