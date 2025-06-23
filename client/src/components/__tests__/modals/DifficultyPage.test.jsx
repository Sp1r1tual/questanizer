import { render, screen, fireEvent } from "@testing-library/react";
import DifficultyPage from "../../modals/DifficultyPage";

import styles from "../../modals/DifficultyPage.module.css";

describe("DifficultyPage", () => {
    const setup = (props = {}) => {
        const defaultProps = {
            difficulty: null,
            onSelectDifficulty: jest.fn(),
            onBack: jest.fn(),
            onConfirm: jest.fn(),
        };
        const mergedProps = Object.assign({}, defaultProps, props);

        return {
            ...render(<DifficultyPage {...mergedProps} />),
            ...mergedProps,
        };
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders all difficulty buttons and action buttons", () => {
        setup();
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
        expect(
            screen.getByRole("button", { name: /Back/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /Confirm/i })
        ).toBeInTheDocument();
    });

    it("calls onSelectDifficulty when the difficulty button is clicked", () => {
        const { onSelectDifficulty } = setup();
        const mediumButton = screen.getByRole("button", { name: /Medium/i });

        fireEvent.click(mediumButton);

        expect(onSelectDifficulty).toHaveBeenCalledTimes(1);
        expect(onSelectDifficulty).toHaveBeenCalledWith("medium");
    });

    it("calls onBack when the Back button is clicked", () => {
        const { onBack } = setup();
        const backButton = screen.getByRole("button", { name: /Back/i });

        fireEvent.click(backButton);

        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it("does not call onConfirm if no difficulty is selected (button disabled)", () => {
        const { onConfirm } = setup();

        const confirmButton = screen.getByRole("button", { name: /Confirm/i });
        expect(confirmButton).toBeDisabled();

        fireEvent.click(confirmButton);

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("calls onConfirm if the difficulty is selected", () => {
        const { onConfirm } = setup({ difficulty: "hard" });
        const confirmButton = screen.getByRole("button", { name: /Confirm/i });

        expect(confirmButton).toBeEnabled();

        fireEvent.click(confirmButton);

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("the button that corresponds to the selected difficulty has the class 'selected'", () => {
        setup({ difficulty: "critical" });

        const criticalButton = screen.getByRole("button", {
            name: /Critical/i,
        });

        expect(criticalButton).toHaveClass(styles.selected);
    });

    it("The Confirm button becomes active after selecting the difficulty.", async () => {
        const { rerender, onSelectDifficulty } = setup({ difficulty: null });

        const confirmButton = screen.getByRole("button", { name: /Confirm/i });
        expect(confirmButton).toBeDisabled();

        const mediumButton = screen.getByRole("button", { name: /Medium/i });
        fireEvent.click(mediumButton);

        rerender(
            <DifficultyPage
                difficulty="medium"
                onSelectDifficulty={onSelectDifficulty}
                onBack={jest.fn()}
                onConfirm={jest.fn()}
            />
        );

        expect(screen.getByRole("button", { name: /Confirm/i })).toBeEnabled();
    });
});
