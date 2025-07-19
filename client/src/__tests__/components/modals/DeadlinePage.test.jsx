import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DeadlinePage from "../../../components/modals/DeadlinePage";

describe("DeadlinePage", () => {
    const mockOnDateChange = jest.fn();
    const mockOnAddWithDeadline = jest.fn();
    const mockOnAddWithoutDeadline = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) => {
        const defaultProps = {
            deadline: "",
            isDateInvalid: false,
            onDateChange: mockOnDateChange,
            onAddWithDeadline: mockOnAddWithDeadline,
            onAddWithoutDeadline: mockOnAddWithoutDeadline,
            onClose: mockOnClose,
        };

        return render(<DeadlinePage {...defaultProps} {...props} />);
    };

    it("renders the date input and buttons correctly", () => {
        renderComponent();

        expect(
            screen.getByLabelText(/Select Deadline Date/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/dd\/mm\/yyyy/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Add with deadline/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Add without deadline/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Cancel/i })
        ).toBeInTheDocument();
    });

    it("displays the provided deadline value in the input", () => {
        const testDeadline = "2025-12-31";

        renderComponent({ deadline: testDeadline });
        expect(screen.getByDisplayValue(testDeadline)).toBeInTheDocument();
    });

    it("calls onDateChange when the date input value changes", () => {
        renderComponent();
        const dateInput = screen.getByLabelText(/Select Deadline Date/i);
        const newDate = "2026-01-15";

        fireEvent.change(dateInput, { target: { value: newDate } });
        expect(mockOnDateChange).toHaveBeenCalledTimes(1);
        expect(mockOnDateChange).toHaveBeenCalledWith(expect.any(Object));
    });

    it('calls onAddWithDeadline when "Add with deadline" button is clicked', () => {
        renderComponent();
        fireEvent.click(
            screen.getByRole("button", { name: /Add with deadline/i })
        );
        expect(mockOnAddWithDeadline).toHaveBeenCalledTimes(1);
    });

    it('calls onAddWithoutDeadline when "Add without deadline" button is clicked', () => {
        renderComponent();
        fireEvent.click(
            screen.getByRole("button", { name: /Add without deadline/i })
        );
        expect(mockOnAddWithoutDeadline).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when "Cancel" button is clicked', () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("displays error message when isDateInvalid is true and deadline is set", () => {
        const currentYear = new Date().getFullYear();

        renderComponent({ isDateInvalid: true, deadline: "2024-01-01" });
        expect(
            screen.getByText(
                `Please select a year between ${currentYear} and 2099`
            )
        ).toBeInTheDocument();
    });

    it("does not display error message when isDateInvalid is false", () => {
        renderComponent({ isDateInvalid: false, deadline: "2025-01-01" });

        const currentYear = new Date().getFullYear();

        expect(
            screen.queryByText(
                `Please select a year between ${currentYear} and 2099`
            )
        ).not.toBeInTheDocument();
    });

    it("does not display error message when isDateInvalid is true but deadline is empty", () => {
        renderComponent({ isDateInvalid: true, deadline: "" });

        const currentYear = new Date().getFullYear();

        expect(
            screen.queryByText(
                `Please select a year between ${currentYear} and 2099`
            )
        ).not.toBeInTheDocument();
    });

    it("focuses the date input when the wrapper div is clicked", () => {
        renderComponent();

        const dateInput = screen.getByLabelText(/Select Deadline Date/i);

        const focusSpy = jest.spyOn(dateInput, "focus");

        fireEvent.click(dateInput.closest("div"));

        expect(focusSpy).toHaveBeenCalledTimes(1);
        focusSpy.mockRestore();
    });

    it("calls showPicker on input when wrapper div is clicked (if supported)", () => {
        renderComponent();

        const dateInput = screen.getByLabelText(/Select Deadline Date/i);

        dateInput.showPicker = jest.fn();

        fireEvent.click(dateInput.closest("div"));

        expect(dateInput.showPicker).toHaveBeenCalledTimes(1);
        dateInput.showPicker = undefined;
    });
});
