import { render, screen, fireEvent } from "@testing-library/react";
import BossBattleStartBtn from "../../boss/components/BossBattleStartBtn";

describe("BossBattleStartBtn", () => {
    it("renders a button with text and calls the passed onClick when clicked", () => {
        const mockOnClick = jest.fn();

        render(<BossBattleStartBtn onClick={mockOnClick} />);

        const button = screen.getByRole("button", {
            name: /start a boss fight/i,
        });

        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
