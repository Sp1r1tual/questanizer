import { useBoss } from "../../boss/useBoss";
import { useBossManager } from "../../boss/useBossManager";
import { useBossCombat } from "../../boss/useBossCombat";

import { renderHook, act } from "@testing-library/react";

jest.mock("../../boss/useBossManager", () => ({
    useBossManager: jest.fn(),
}));

jest.mock("../../boss/useBossCombat", () => ({
    useBossCombat: jest.fn(),
}));

describe("useBoss", () => {
    const mockBoss = { bossName: "Skeleton King", healthPoints: 100 };
    const initBoss = jest.fn();
    const resetCurrentBoss = jest.fn();
    const handleBossVictory = jest.fn();
    const handleTaskCompletedInternal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useBossManager.mockReturnValue({
            boss: mockBoss,
            initBoss,
            resetCurrentBoss,
        });

        useBossCombat.mockReturnValue({
            handleTaskCompleted: handleTaskCompletedInternal,
            handleBossVictory,
        });
    });

    it("returns correct values", () => {
        const { result } = renderHook(() => useBoss());

        expect(result.current.boss).toEqual(mockBoss);
        expect(result.current.initBoss).toBe(initBoss);
        expect(typeof result.current.handleTaskCompleted).toBe("function");
    });

    it("does not trigger victory/reset if the boss is not dead", () => {
        handleTaskCompletedInternal.mockReturnValue({ isDead: false });

        const { result } = renderHook(() => useBoss());

        act(() => {
            result.current.handleTaskCompleted("hard", true);
        });

        expect(handleTaskCompletedInternal).toHaveBeenCalledWith("hard", true);
        expect(handleBossVictory).not.toHaveBeenCalled();
        expect(resetCurrentBoss).not.toHaveBeenCalled();
    });

    it("triggers victory and resets if the boss is dead", () => {
        handleTaskCompletedInternal.mockReturnValue({ isDead: true });

        const { result } = renderHook(() => useBoss());

        act(() => {
            result.current.handleTaskCompleted("hard", false);
        });

        expect(handleTaskCompletedInternal).toHaveBeenCalledWith("hard", false);
        expect(handleBossVictory).toHaveBeenCalledTimes(1);
        expect(resetCurrentBoss).toHaveBeenCalledWith(true);
    });
});
