import useUserStatsHook from "../../../hooks/stats/useUserStats";
import useAuthHook from "../../../hooks/auth/useAuth";

import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import UserStatsView from "../../../components/stats/UserStatsView";
import { fetchStats } from "../../../store/stats/userStatsThunks";
import { resetBoss } from "../../../store/boss/bossBattleSlice";

const mockStore = configureStore([]);

jest.mock("../../../hooks/stats/useUserStats", () => jest.fn());
jest.mock("../../../hooks/auth/useAuth", () => jest.fn());
jest.mock("../../../store/stats/userStatsThunks", () => ({
    fetchStats: jest.fn(),
}));
jest.mock("../../../store/boss/bossBattleSlice", () => ({
    resetBoss: jest.fn(),
}));

jest.mock("../../../components/modals/DefeatUserModal", () => (props) => (
    <div data-testid="defeat-modal">
        <button onClick={props.onRestart}>restart</button>
    </div>
));

jest.mock("../../../components/stats/UserExperience", () => () => (
    <div>Level: 2</div>
));
jest.mock("../../../components/stats/UserHealth", () => () => (
    <div>Health: 100</div>
));

describe("UserStatsView", () => {
    let store;

    beforeEach(() => {
        store = mockStore({});
        store.dispatch = jest.fn();

        useUserStatsHook.mockReturnValue({
            experience: 50,
            level: 2,
            health: 100,
            maxHealth: 150,
        });

        useAuthHook.mockReturnValue({
            user: { id: "user123" },
        });

        fetchStats.mockReturnValue({ type: "FETCH_STATS" });
        resetBoss.mockReturnValue({ type: "RESET_BOSS" });
    });

    it("dispatches fetchStats when user exists", () => {
        render(
            <Provider store={store}>
                <UserStatsView />
            </Provider>
        );

        expect(store.dispatch).toHaveBeenCalledWith({ type: "FETCH_STATS" });
    });

    it("renders experience and health components", () => {
        render(
            <Provider store={store}>
                <UserStatsView />
            </Provider>
        );

        expect(screen.getByText(/Level: 2/)).toBeInTheDocument();
        expect(screen.getByText(/Health: 100/)).toBeInTheDocument();
    });

    it("shows DefeatUserModal when health is 0 or below", () => {
        useUserStatsHook.mockReturnValueOnce({
            experience: 0,
            level: 1,
            health: 0,
            maxHealth: 100,
        });

        render(
            <Provider store={store}>
                <UserStatsView />
            </Provider>
        );

        expect(screen.getByTestId("defeat-modal")).toBeInTheDocument();
    });

    it("calls resetBoss when restart is triggered", () => {
        useUserStatsHook.mockReturnValueOnce({
            experience: 0,
            level: 1,
            health: 0,
            maxHealth: 100,
        });

        render(
            <Provider store={store}>
                <UserStatsView />
            </Provider>
        );

        fireEvent.click(screen.getByText(/restart/i));
        expect(store.dispatch).toHaveBeenCalledWith({ type: "RESET_BOSS" });
    });
});
