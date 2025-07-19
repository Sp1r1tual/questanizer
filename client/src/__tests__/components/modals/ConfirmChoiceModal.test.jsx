import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmChoiceModal from "../../../components/modals/ConfirmChoiceModal";

describe("ConfirmChoiceModal", () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();
    const titleText = "Confirm Action";
    const messageText = "Are you sure you want to proceed?";

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnConfirm.mockClear();
    });

    it("does not render when isOpen is false", () => {
        render(
            <ConfirmChoiceModal
                isOpen={false}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title={titleText}
                message={messageText}
            />
        );
        expect(screen.queryByText(titleText)).not.toBeInTheDocument();
        expect(screen.queryByText(messageText)).not.toBeInTheDocument();
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders correctly when isOpen is true with provided props", () => {
        render(
            <ConfirmChoiceModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title={titleText}
                message={messageText}
            />
        );

        expect(screen.getByText(titleText)).toBeInTheDocument();
        expect(screen.getByText(messageText)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Yes/i })
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /No/i })).toBeInTheDocument();
        expect(screen.getByTestId("backdrop")).toBeInTheDocument();
    });

    it('calls onConfirm when the "Yes" button is clicked', () => {
        render(
            <ConfirmChoiceModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title={titleText}
                message={messageText}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /Yes/i }));
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when the "No" button is clicked', () => {
        render(
            <ConfirmChoiceModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title={titleText}
                message={messageText}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: /No/i }));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it("calls onClose when clicking on the backdrop", () => {
        render(
            <ConfirmChoiceModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title={titleText}
                message={messageText}
            />
        );

        fireEvent.click(screen.getByTestId("backdrop"));
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when clicking inside the modal (not on backdrop)", () => {
        render(
            <ConfirmChoiceModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title={titleText}
                message={messageText}
            />
        );

        fireEvent.click(screen.getByText(titleText));
        expect(mockOnClose).not.toHaveBeenCalled();
    });
});
