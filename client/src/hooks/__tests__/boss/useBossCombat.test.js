import { useSelector, useDispatch } from "react-redux";
import { useUserStats } from "../../stats/useUserStats";
import { useBossCombat } from "../../boss/useBossCombat";

import { renderHook, act } from "@testing-library/react";
import * as bossActions from "../../../store/boss/bossBattleSlice";

jest.mock("react-redux", () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock("../../../hooks/stats/useUserStats", () => ({
    useUserStats: jest.fn(),
}));

describe("useBossCombat", () => {
    const dispatch = jest.fn();
    const addXP = jest.fn();
    const damage = jest.fn();
    const mockAlert = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(dispatch);
        useUserStats.mockReturnValue({ addXP, damage });
        global.alert = mockAlert;

        useSelector.mockImplementation((selector) =>
            selector({
                bossBattle: {
                    bossId: 1,
                    bossName: "Demon",
                    bossRewardExp: 100,
                    bossPower: 25,
                    bossRageBar: 3,
                    healthPoints: 50,
                    rage: 1,
                    alreadyRagedTaskIds: [],
                },
                tasks: {
                    tasks: [
                        {
                            id: "t1",
                            isCompleted: false,
                            deadline: new Date(
                                Date.now() - 3600 * 1000
                            ).toISOString(), // overdue
                        },
                    ],
                },
            })
        );
    });

    it("handleTaskCompleted dispatches correct damage logic", () => {
        const { result } = renderHook(() => useBossCombat());

        act(() => {
            const output = result.current.handleTaskCompleted("hard", true);
            expect(output.isDead).toBe(false);
            expect(output.damage).toBeGreaterThan(0);
            expect(dispatch).toHaveBeenCalledWith(expect.any(Object));
            expect(dispatch).toHaveBeenCalledWith(
                bossActions.updateHealthBar()
            );
        });
    });

    it("handleTaskCompleted detects boss death", () => {
        useSelector.mockImplementationOnce((selector) =>
            selector({
                bossBattle: {
                    bossId: 1,
                    healthPoints: 5,
                    bossRewardExp: 100,
                    bossPower: 25,
                    bossRageBar: 3,
                    rage: 1,
                    alreadyRagedTaskIds: [],
                },
                tasks: {
                    tasks: [],
                },
            })
        );

        const { result } = renderHook(() => useBossCombat());

        act(() => {
            const output = result.current.handleTaskCompleted("hard", true);
            expect(output.isDead).toBe(true);
        });
    });

    it("handleBossVictory calls addXP and alert", () => {
        const { result } = renderHook(() => useBossCombat());

        act(() => {
            const won = result.current.handleBossVictory();
            expect(addXP).toHaveBeenCalledWith(100);
            expect(mockAlert).toHaveBeenCalledWith(
                expect.stringContaining("Victory")
            );
            expect(won).toBe(true);
        });
    });

    it("handleOverdueTasks triggers rage update and damage", () => {
        const { result } = renderHook(() => useBossCombat());

        act(() => {
            result.current.handleOverdueTasks();
        });

        expect(dispatch).toHaveBeenCalledWith(bossActions.updateRageBar(1));
        expect(dispatch).toHaveBeenCalledWith(
            bossActions.markTaskAsRaged("t1")
        );
        expect(damage).not.toHaveBeenCalled(); // rage = 2 (1 + 1), still < rageBar
    });

    it("triggers boss attack when rage threshold reached", () => {
        useSelector.mockImplementationOnce((selector) =>
            selector({
                bossBattle: {
                    bossId: "01",
                    bossName: "Demon",
                    bossRewardExp: 100,
                    bossPower: 25,
                    bossRageBar: 3,
                    rage: 2,
                    alreadyRagedTaskIds: [],
                },
                tasks: {
                    tasks: [
                        {
                            id: "t1",
                            isCompleted: false,
                            deadline: new Date(
                                Date.now() - 3600 * 1000
                            ).toISOString(),
                        },
                    ],
                },
            })
        );

        const { result } = renderHook(() => useBossCombat());

        act(() => {
            result.current.handleOverdueTasks();
        });

        expect(mockAlert).toHaveBeenCalledWith(
            expect.stringContaining("attacks")
        );
        expect(damage).toHaveBeenCalledWith(25);
        expect(dispatch).toHaveBeenCalledWith(bossActions.resetRage());
    });
});
