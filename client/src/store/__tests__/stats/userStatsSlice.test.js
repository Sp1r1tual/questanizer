import statsReducer, {
    gainExperience,
    takeDamage,
    heal,
    resetStats,
} from "../../stats/userStatsSlice";

describe("statsSlice", () => {
    const initialState = {
        experience: 0,
        level: 1,
        health: 100,
        maxHealth: 100,
    };

    it("must return the initial state when an undefined state is passed", () => {
        expect(statsReducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(
            initialState
        );
    });

    it("gainExperience should add experience without increasing the level", () => {
        const currentState = { ...initialState, experience: 50 };
        const experienceGained = 30;
        const expectedState = { ...currentState, experience: 80 };

        expect(
            statsReducer(currentState, gainExperience(experienceGained))
        ).toEqual(expectedState);
    });

    it("gainExperience should increase the level by 1 when the threshold is reached", () => {
        const currentState = {
            ...initialState,
            experience: 90,
            level: 1,
            health: 50,
        };
        const experienceGained = 20;
        const expectedState = {
            experience: 10,
            level: 2,
            health: 100,
            maxHealth: 100,
        };

        expect(
            statsReducer(currentState, gainExperience(experienceGained))
        ).toEqual(expectedState);
    });

    it("gainExperience should level up several times if a lot of experience is gained", () => {
        const currentState = {
            ...initialState,
            experience: 80,
            level: 1,
            health: 50,
        };
        const experienceGained = 250;
        const expectedState = {
            experience: 30,
            level: 3,
            health: 100,
            maxHealth: 100,
        };

        expect(
            statsReducer(currentState, gainExperience(experienceGained))
        ).toEqual(expectedState);
    });

    it("takeDamage should reduce health", () => {
        const currentState = { ...initialState, health: 80 };
        const damage = 20;
        const expectedState = { ...currentState, health: 60 };

        expect(statsReducer(currentState, takeDamage(damage))).toEqual(
            expectedState
        );
    });

    it("takeDamage should set health to 0 if damage exceeds current health", () => {
        const currentState = { ...initialState, health: 10 };
        const damage = 50;
        const expectedState = { ...currentState, health: 0 };

        expect(statsReducer(currentState, takeDamage(damage))).toEqual(
            expectedState
        );
    });

    it("heal should restore health", () => {
        const currentState = { ...initialState, health: 50 };
        const healAmount = 30;
        const expectedState = { ...currentState, health: 80 };

        expect(statsReducer(currentState, heal(healAmount))).toEqual(
            expectedState
        );
    });

    it("heal should limit health to maxHealth", () => {
        const currentState = { ...initialState, health: 90, maxHealth: 100 };
        const healAmount = 50;
        const expectedState = { ...currentState, health: 100 };

        expect(statsReducer(currentState, heal(healAmount))).toEqual(
            expectedState
        );
    });

    it("resetStats should reset the status to the original", () => {
        const currentState = {
            experience: 150,
            level: 2,
            health: 75,
            maxHealth: 100,
        };

        expect(statsReducer(currentState, resetStats())).toEqual(initialState);
    });
});
