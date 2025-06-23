import { render, screen, fireEvent } from "@testing-library/react";
import DeadlinePage from "../../modals/DeadlinePage";

describe("DeadlinePage", () => {
    const setup = (props = {}) => {
        const defaultProps = {
            deadline: "",
            isDateInvalid: false,
            onDateChange: jest.fn(),
            onAddWithDeadline: jest.fn(),
            onAddWithoutDeadline: jest.fn(),
            onClose: jest.fn(),
        };
        render(<DeadlinePage {...defaultProps} {...props} />);
        return defaultProps;
    };

    it("renders input of type date", () => {
        setup();
        const input = screen.getByLabelText(/Select Deadline Date/i);

        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("type", "date");
    });

    it("calls onDateChange when the date changes", () => {
        const { onDateChange } = setup();
        const input = screen.getByLabelText(/Select Deadline Date/i);

        fireEvent.change(input, { target: { value: "2025-06-30" } });

        expect(onDateChange).toHaveBeenCalledWith(expect.any(Object));
    });

    it("renders an error message if the date is invalid", () => {
        setup({ deadline: "2025-01-01", isDateInvalid: true });

        expect(
            screen.getByText(/Please select a year between/i)
        ).toBeInTheDocument();
    });

    it("calls onAddWithDeadline when clicking on Add with deadline", () => {
        const onAddWithDeadline = jest.fn();

        setup({ onAddWithDeadline });

        const btn = screen.getByRole("button", { name: /add with deadline/i });

        fireEvent.click(btn);

        expect(onAddWithDeadline).toHaveBeenCalled();
    });

    it("calls onAddWithoutDeadline when clicking Add without deadline", () => {
        const onAddWithoutDeadline = jest.fn();

        setup({ onAddWithoutDeadline });

        const btn = screen.getByRole("button", {
            name: /add without deadline/i,
        });

        fireEvent.click(btn);

        expect(onAddWithoutDeadline).toHaveBeenCalled();
    });

    it("calls onClose when Cancel is clicked", () => {
        const onClose = jest.fn();

        setup({ onClose });

        const btn = screen.getByRole("button", { name: /cancel/i });

        fireEvent.click(btn);

        expect(onClose).toHaveBeenCalled();
    });
});
