import reducer, { clearStatsState } from "../../../store/stats/userStatsSlice";
import { fetchStats, resetStats } from "../../../store/stats/userStatsThunks";

const initialState = {
    experience: 0,
    level: 1,
    health: 100,
    maxHealth: 100,
};

describe("statsSlice", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it("should reset state to initial on clearStatsState", () => {
        const modifiedState = {
            experience: 200,
            level: 5,
            health: 50,
            maxHealth: 120,
        };
        const state = reducer(modifiedState, clearStatsState());

        expect(state).toEqual(initialState);
    });

    it("should handle fetchStats.fulfilled", () => {
        const payload = {
            xp: 300,
            level: 4,
            hp: 75,
            maxHp: 110,
        };

        const state = reducer(initialState, {
            type: fetchStats.fulfilled.type,
            payload,
        });

        expect(state.experience).toBe(300);
        expect(state.level).toBe(4);
        expect(state.health).toBe(75);
        expect(state.maxHealth).toBe(110);
    });

    it("should handle resetStats.fulfilled", () => {
        const payload = {
            stats: {
                xp: 0,
                level: 1,
                hp: 100,
                maxHp: 100,
            },
        };

        const state = reducer(
            {
                experience: 500,
                level: 10,
                health: 10,
                maxHealth: 200,
            },
            {
                type: resetStats.fulfilled.type,
                payload,
            }
        );

        expect(state).toEqual({
            experience: 0,
            level: 1,
            health: 100,
            maxHealth: 100,
        });
    });
});
