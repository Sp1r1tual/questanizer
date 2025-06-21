import { useUserStats } from "../../stats/useUserStats";
import { useDispatch, useSelector } from "react-redux";

import { renderHook } from "@testing-library/react";
import {
    gainExperience,
    takeDamage,
    heal,
} from "../../../store/stats/userStatsSlice";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

describe("useUserStats (Unit Test)", () => {
    let mockDispatch;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDispatch = jest.fn();
        mockSelector = jest.fn();

        useDispatch.mockReturnValue(mockDispatch);
        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                stats: {
                    experience: 0,
                    level: 1,
                    health: 100,
                    maxHealth: 100,
                },
            })
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("returns the initial state values ​​from the Redux page", () => {
        const { result } = renderHook(() => useUserStats());

        expect(result.current.experience).toBe(0);
        expect(result.current.level).toBe(1);
        expect(result.current.health).toBe(100);
        expect(result.current.maxHealth).toBe(100);

        returnedAddXP = result.current.addXP;
        returnedDamage = result.current.damage;
        returnedRecover = result.current.recover;
    });

    it("the addXP method dispatches the gainExperience action", () => {
        const { result } = renderHook(() => useUserStats());
        const xpAmount = 50;

        result.current.addXP(xpAmount);

        expect(mockDispatch).toHaveBeenCalledWith(gainExperience(xpAmount));
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it("the damage method dispatches the takeDamage action", () => {
        const { result } = renderHook(() => useUserStats());

        const damageAmount = 30;

        result.current.damage(damageAmount);

        expect(mockDispatch).toHaveBeenCalledWith(takeDamage(damageAmount));
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it("the recover method dispatches the heal action", () => {
        const { result } = renderHook(() => useUserStats());

        const healAmount = 20;

        result.current.recover(healAmount);

        expect(mockDispatch).toHaveBeenCalledWith(heal(healAmount));
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it("updates the value when the state of the Redux page changes", () => {
        const { result, rerender } = renderHook(() => useUserStats());

        expect(result.current.experience).toBe(0);

        useSelector.mockImplementation((selectorFn) =>
            selectorFn({
                stats: {
                    experience: 75,
                    level: 1,
                    health: 90,
                    maxHealth: 100,
                },
            })
        );

        rerender();

        expect(result.current.experience).toBe(75);
        expect(result.current.health).toBe(90);
    });
});
