import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BossBattleStartBtn from "../../../routes/pages/boss/components/BossBattleStartBtn";

describe("BossBattleStartBtn", () => {
    it("renders the button with correct text", () => {
        render(<BossBattleStartBtn onClick={() => {}} />);
        expect(
            screen.getByRole("button", { name: /start a boss fight/i })
        ).toBeInTheDocument();
    });

    it("calls onClick handler when clicked", () => {
        const onClickMock = jest.fn();

        render(<BossBattleStartBtn onClick={onClickMock} />);

        const button = screen.getByRole("button", {
            name: /start a boss fight/i,
        });

        fireEvent.click(button);

        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});
