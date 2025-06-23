import { render, screen, fireEvent, act } from "@testing-library/react";
import UserStatsView from "../../stats/UserStatsView";
import { resetBoss } from "../../../store/boss/bossBattleSlice";

const mockCheckOverdueTasks = jest.fn();
const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

jest.mock("../../../hooks/tasks/useTasks", () => ({
    useTasks: () => ({
        checkOverdueTasks: mockCheckOverdueTasks,
    }),
}));

jest.mock("../../../hooks/stats/useUserStats", () => ({
    useUserStats: jest.fn(),
}));

jest.mock("../../modals/DefeatUserModal", () => (props) => (
    <div data-testid="defeat-modal">
        <button onClick={props.onRestart}>Restart</button>
    </div>
));

jest.mock("../../../store/boss/bossBattleSlice", () => ({
    resetBoss: (payload) => ({ type: "bossBattle/resetBoss", payload }),
}));

jest.mock("../../stats/UserExperience", () => () => <div data-testid="xp" />);
jest.mock("../../stats/UserHealth", () => () => <div data-testid="hp" />);
jest.mock("../../ui/Container", () => (props) => (
    <div data-testid="container">{props.children}</div>
));

describe("UserStatsView", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("renders experience and health", () => {
        const useUserStats =
            require("../../../hooks/stats/useUserStats").useUserStats;

        useUserStats.mockReturnValue({
            experience: 100,
            level: 3,
            health: 80,
            maxHealth: 100,
        });

        render(<UserStatsView />);
        expect(screen.getByTestId("xp")).toBeInTheDocument();
        expect(screen.getByTestId("hp")).toBeInTheDocument();
    });

    it("shows defeat modal when health <= 0", () => {
        const useUserStats =
            require("../../../hooks/stats/useUserStats").useUserStats;
        useUserStats.mockReturnValue({
            experience: 200,
            level: 5,
            health: 0,
            maxHealth: 100,
        });

        render(<UserStatsView />);
        expect(screen.getByTestId("defeat-modal")).toBeInTheDocument();
    });

    it("when clicking 'Restart' it calls resetBoss and hides the modal", () => {
        const useUserStats =
            require("../../../hooks/stats/useUserStats").useUserStats;
        useUserStats.mockReturnValue({
            experience: 300,
            level: 6,
            health: 0,
            maxHealth: 100,
        });

        render(<UserStatsView />);

        fireEvent.click(screen.getByText("Restart"));

        expect(mockDispatch).toHaveBeenCalledWith(
            resetBoss({ defeated: true })
        );
    });

    it("periodically calls checkOverdueTasks", () => {
        const useUserStats =
            require("../../../hooks/stats/useUserStats").useUserStats;
        useUserStats.mockReturnValue({
            experience: 150,
            level: 2,
            health: 50,
            maxHealth: 100,
        });

        render(<UserStatsView />);
        expect(mockCheckOverdueTasks).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(5 * 60 * 1000);
        });

        expect(mockCheckOverdueTasks).toHaveBeenCalledTimes(2);
    });
});
