import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmChoiceModal from "../../modals/ConfirmChoiceModal";

describe("ConfirmChoiceModal", () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();
    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onConfirm: mockOnConfirm,
        title: "Confirm Action",
        message: "Are you sure you want to proceed?",
    };

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnConfirm.mockClear();
    });

    it("does not render the modal when isOpen is false", () => {
        render(<ConfirmChoiceModal {...defaultProps} isOpen={false} />);
        expect(screen.queryByText(/Confirm Action/i)).not.toBeInTheDocument();
        expect(
            screen.queryByText(/Are you sure you want to proceed?/i)
        ).not.toBeInTheDocument();
    });

    it("renders the modal with correct title and message when isOpen is true", () => {
        render(<ConfirmChoiceModal {...defaultProps} />);

        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.message)).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /Yes/i })
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /No/i })).toBeInTheDocument();
    });

    it('calls onConfirm when the "Yes" button is clicked', () => {
        render(<ConfirmChoiceModal {...defaultProps} />);

        const yesButton = screen.getByRole("button", { name: /Yes/i });

        fireEvent.click(yesButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when the "No" button is clicked', () => {
        render(<ConfirmChoiceModal {...defaultProps} />);

        const noButton = screen.getByRole("button", { name: /No/i });

        fireEvent.click(noButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("calls onClose when the backdrop is clicked", () => {
        render(<ConfirmChoiceModal {...defaultProps} />);

        const backdrop = screen.getByTestId("backdrop");

        fireEvent.click(backdrop);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when the modal content is clicked", () => {
        render(<ConfirmChoiceModal {...defaultProps} />);

        const modalContent = screen
            .getByText(defaultProps.title)
            .closest("div");

        fireEvent.click(modalContent);

        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
