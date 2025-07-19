import { useDispatch } from "react-redux";

import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DefeatUserModal from "../../../components/modals/DefeatUserModal";
import { resetStats } from "../../../store/stats/userStatsThunks";
import { resetBoss } from "../../../store/boss/bossBattleSlice";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
}));

jest.mock("../../../store/stats/userStatsThunks", () => ({
    resetStats: jest.fn(),
}));

jest.mock("../../../store/boss/bossBattleSlice", () => ({
    resetBoss: jest.fn(),
}));

describe("DefeatUserModal", () => {
    const mockOnRestart = jest.fn();
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockDispatch.mockImplementation((action) => {
            if (typeof action === "function") {
                return action(mockDispatch);
            }

            return action;
        });

        useDispatch.mockReturnValue(mockDispatch);

        resetStats.mockImplementation(() => {
            return () => ({
                unwrap: () => Promise.resolve(),
            });
        });

        resetBoss.mockImplementation(() => jest.fn());
    });

    it("renders the defeat message and restart button", () => {
        render(<DefeatUserModal onRestart={mockOnRestart} />);

        expect(screen.getByText("Defeat")).toBeInTheDocument();
        expect(
            screen.getByText(
                "You have lost all your HP❤️. Can we start again?⚡"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: /Start a new epic adventure🧭/i,
            })
        ).toBeInTheDocument();
    });

    it("calls resetStats, resetBoss, and onRestart when the button is clicked", async () => {
        render(<DefeatUserModal onRestart={mockOnRestart} />);

        const restartButton = screen.getByRole("button", {
            name: /Start a new epic adventure🧭/i,
        });

        fireEvent.click(restartButton);

        await waitFor(() => {
            expect(resetStats).toHaveBeenCalledTimes(1);
            expect(resetBoss).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledTimes(2);
            expect(mockOnRestart).toHaveBeenCalledTimes(1);
        });
    });

    it("handles resetStats thunk rejection gracefully", async () => {
        resetStats.mockImplementation(() => {
            return () => ({
                unwrap: () =>
                    Promise.reject(new Error("Reset failed from thunk")),
            });
        });

        const consoleErrorSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        render(<DefeatUserModal onRestart={mockOnRestart} />);

        const restartButton = screen.getByRole("button", {
            name: /Start a new epic adventure🧭/i,
        });

        fireEvent.click(restartButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Reset failed",
                expect.any(Error)
            );
        });

        expect(mockOnRestart).not.toHaveBeenCalled();
        expect(resetBoss).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
