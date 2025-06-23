import { render, screen, fireEvent } from "@testing-library/react";
import TaskModal from "../../modals/TaskModal";

jest.mock("../../modals/DeadlinePage", () => (props) => (
    <div data-testid="deadline-page">
        <input
            data-testid="date-input"
            type="date"
            value={props.deadline}
            onChange={(event) => props.onDateChange(event)}
        />
        <button onClick={props.onAddWithDeadline}>With Deadline</button>
        <button onClick={props.onAddWithoutDeadline}>Without Deadline</button>
        <button onClick={props.onClose}>Close</button>
    </div>
));

jest.mock("../../modals/DifficultyPage", () => (props) => (
    <div data-testid="difficulty-page">
        <button onClick={() => props.onSelectDifficulty("easy")}>Easy</button>
        <button onClick={props.onBack}>Back</button>
        <button onClick={props.onConfirm}>Confirm</button>
    </div>
));

describe("TaskModal", () => {
    const setup = (props = {}) => {
        const defaultProps = {
            deadline: "",
            setDeadline: jest.fn(),
            onSubmit: jest.fn(),
            onClose: jest.fn(),
            isOpen: true,
        };
        return render(<TaskModal {...defaultProps} {...props} />);
    };

    test("not rendered if isOpen = false", () => {
        const { container } = setup({ isOpen: false });

        expect(container).toBeEmptyDOMElement();
    });

    test("the deadline page is rendered", () => {
        setup();
        expect(screen.getByTestId("deadline-page")).toBeInTheDocument();
    });

    test("with a valid date, goes to the difficulty page", () => {
        const validDate = "2099-12-31";

        setup({ deadline: validDate });

        const dateInput = screen.getByTestId("date-input");

        fireEvent.change(dateInput, { target: { value: validDate } });

        fireEvent.click(screen.getByText("With Deadline"));

        expect(screen.getByTestId("difficulty-page")).toBeInTheDocument();
    });

    test("when clicking 'Without Deadline' also goes to difficulty", () => {
        setup();

        fireEvent.click(screen.getByText("Without Deadline"));

        expect(screen.getByTestId("difficulty-page")).toBeInTheDocument();
    });

    test("you can go back from difficulty to deadline", () => {
        setup();

        fireEvent.click(screen.getByText("Without Deadline"));

        expect(screen.getByTestId("difficulty-page")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Back"));

        expect(screen.getByTestId("deadline-page")).toBeInTheDocument();
    });

    test("onSubmit is called after selecting the difficulty and confirming", () => {
        const mockSubmit = jest.fn();
        const mockClose = jest.fn();
        const setDeadline = jest.fn();

        setup({
            deadline: "2099-12-31",
            onSubmit: mockSubmit,
            onClose: mockClose,
            setDeadline,
        });

        fireEvent.click(screen.getByText("With Deadline"));
        fireEvent.click(screen.getByText("Easy"));
        fireEvent.click(screen.getByText("Confirm"));

        expect(mockSubmit).toHaveBeenCalledWith({
            hasDeadline: true,
            difficulty: "easy",
        });
        expect(mockClose).toHaveBeenCalled();
    });

    test("does not call onSubmit without a selected complexity", () => {
        const mockSubmit = jest.fn();

        setup({
            deadline: "2099-12-31",
            onSubmit: mockSubmit,
        });

        fireEvent.click(screen.getByText("With Deadline"));

        expect(screen.getByTestId("difficulty-page")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Confirm"));

        expect(mockSubmit).not.toHaveBeenCalled();
    });
});
