import { useDispatch } from "react-redux";

import { render, screen, fireEvent } from "@testing-library/react";
import DefeatUserModal from "../../modals/DefeatUserModal";
import { resetStats } from "../../../store/stats/userStatsSlice";
import { resetBoss } from "../../../store/boss/bossBattleSlice";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../store/stats/userStatsSlice", () => ({
    resetStats: jest.fn(() => ({ type: "stats/resetStats" })),
}));
jest.mock("../../../store/boss/bossBattleSlice", () => ({
    resetBoss: jest.fn(() => ({ type: "boss/resetBoss" })),
}));

describe("DefeatUserModal", () => {
    let mockDispatch;
    const mockOnRestart = jest.fn();

    beforeEach(() => {
        mockDispatch = jest.fn();
        useDispatch.mockReturnValue(mockDispatch);
        resetStats.mockClear();
        resetBoss.mockClear();
        mockOnRestart.mockClear();
    });

    it("renders the defeat message and restart button", () => {
        render(<DefeatUserModal onRestart={mockOnRestart} />);

        expect(
            screen.getByRole("heading", { name: /defeat/i })
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /You have lost all your HP❤️\. Can we start again\?⚡/i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /Start a new epic adventure🧭/i,
            })
        ).toBeInTheDocument();
    });

    it("calls onRestart and dispatches Redux actions when the button is clicked", () => {
        render(<DefeatUserModal onRestart={mockOnRestart} />);

        const restartButton = screen.getByRole("button", {
            name: /Start a new epic adventure🧭/i,
        });
        fireEvent.click(restartButton);

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(resetStats());
        expect(mockDispatch).toHaveBeenCalledWith(resetBoss());

        expect(mockOnRestart).toHaveBeenCalledTimes(1);
    });
});
