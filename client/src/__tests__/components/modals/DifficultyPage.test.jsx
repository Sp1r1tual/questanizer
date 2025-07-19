import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import DifficultyPage from "../../../components/modals/DifficultyPage";

describe("DifficultyPage", () => {
    const mockOnSelectDifficulty = jest.fn();
    const mockOnBack = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) => {
        const defaultProps = {
            difficulty: "",
            onSelectDifficulty: mockOnSelectDifficulty,
            onBack: mockOnBack,
            onConfirm: mockOnConfirm,
        };
        return render(<DifficultyPage {...defaultProps} {...props} />);
    };

    it("renders all difficulty buttons", () => {
        renderComponent();

        expect(
            screen.getByRole("button", { name: /Easy/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Medium/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Hard/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Critical/i })
        ).toBeInTheDocument();
    });

    it("renders Back and Confirm buttons", () => {
        renderComponent();

        expect(
            screen.getByRole("button", { name: /Back/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Confirm/i })
        ).toBeInTheDocument();
    });

    it("calls onSelectDifficulty with correct level when a difficulty button is clicked", () => {
        renderComponent();

        fireEvent.click(screen.getByRole("button", { name: /Medium/i }));
        expect(mockOnSelectDifficulty).toHaveBeenCalledTimes(1);
        expect(mockOnSelectDifficulty).toHaveBeenCalledWith("medium");

        fireEvent.click(screen.getByRole("button", { name: /Hard/i }));
        expect(mockOnSelectDifficulty).toHaveBeenCalledTimes(2);
        expect(mockOnSelectDifficulty).toHaveBeenCalledWith("hard");
    });

    it('applies "selected" class to the currently selected difficulty button', () => {
        const { rerender } = renderComponent({ difficulty: "easy" });

        expect(screen.getByRole("button", { name: /Easy/i })).toHaveClass(
            "selected"
        );
        expect(screen.getByRole("button", { name: /Medium/i })).not.toHaveClass(
            "selected"
        );
        expect(screen.getByRole("button", { name: /Hard/i })).not.toHaveClass(
            "selected"
        );
        expect(
            screen.getByRole("button", { name: /Critical/i })
        ).not.toHaveClass("selected");

        rerender(
            <DifficultyPage
                difficulty="critical"
                onSelectDifficulty={mockOnSelectDifficulty}
                onBack={mockOnBack}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.getByRole("button", { name: /Critical/i })).toHaveClass(
            "selected"
        );
        expect(screen.getByRole("button", { name: /Easy/i })).not.toHaveClass(
            "selected"
        );
        expect(screen.getByRole("button", { name: /Medium/i })).not.toHaveClass(
            "selected"
        );
        expect(screen.getByRole("button", { name: /Hard/i })).not.toHaveClass(
            "selected"
        );
    });

    it('calls onBack when the "Back" button is clicked', () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button", { name: /Back/i }));
        expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('calls onConfirm when the "Confirm" button is clicked and difficulty is selected', () => {
        renderComponent({ difficulty: "easy" });

        const confirmButton = screen.getByRole("button", { name: /Confirm/i });

        expect(confirmButton).toBeEnabled();
        fireEvent.click(confirmButton);
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it('the "Confirm" button is disabled when no difficulty is selected', () => {
        renderComponent({ difficulty: "" });

        const confirmButton = screen.getByRole("button", { name: /Confirm/i });

        expect(confirmButton).toBeDisabled();
        fireEvent.click(confirmButton);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });
});
