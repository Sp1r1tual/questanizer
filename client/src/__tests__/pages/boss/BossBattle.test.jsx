import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import BossBattle from "../../../routes/pages/boss/components/BossBattle";

jest.mock("../../../hooks/boss/useBoss");
jest.mock(
    "../../../routes/pages/boss/components/BossBattleStartBtn",
    () =>
        ({ onClick }) =>
            <button onClick={onClick}>Mock Start Button</button>
);
jest.mock("../../../routes/pages/boss/components/BossStats", () => () => (
    <div>Mock BossStats</div>
));
jest.mock("../../../routes/pages/boss/components/BossView", () => () => (
    <div>Mock BossView</div>
));

import useBoss from "../../../hooks/boss/useBoss";

const preloadedState = {
    auth: {
        user: { id: "user-123" },
        isAuthenticated: true,
        error: null,
        isAuthChecked: true,
    },
};

const store = configureStore({
    reducer: (state = preloadedState, action) => state,
    preloadedState,
});

const renderWithProvider = (ui) =>
    render(<Provider store={store}>{ui}</Provider>);

describe("BossBattle", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the start button if bossId is missing, and calls initBoss on click", () => {
        const initBoss = jest.fn();

        useBoss.mockReturnValue({
            boss: { bossId: null },
            initBoss,
            loading: false,
        });

        renderWithProvider(<BossBattle />);

        const button = screen.getByRole("button", {
            name: /mock start button/i,
        });

        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        expect(initBoss).toHaveBeenCalledTimes(1);
    });

    it("renders BossStats and BossView if bossId is present", () => {
        useBoss.mockReturnValue({
            boss: { bossId: "boss-001" },
            initBoss: jest.fn(),
            loading: false,
        });

        renderWithProvider(<BossBattle />);

        expect(screen.getByText("Mock BossStats")).toBeInTheDocument();
        expect(screen.getByText("Mock BossView")).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /mock start button/i })
        ).not.toBeInTheDocument();
    });
});
