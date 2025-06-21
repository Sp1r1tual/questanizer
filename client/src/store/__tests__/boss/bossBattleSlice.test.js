import bossBattleReducer, {
    setActiveBoss,
    updateHealthBar,
    takeDamage,
    updateRageBar,
    markTaskAsRaged,
    resetRage,
    resetBoss,
} from "../../boss/bossBattleSlice";

describe("bossBattleSlice", () => {
    const initialState = {
        bossId: null,
        bossName: null,
        healthPoints: 0,
        maxHealth: 0,
        bossPower: 0,
        bossRewardExp: 0,
        bossRageBar: 0,
        rage: 0,
        bossImg: null,
        alreadyRagedTaskIds: [],
        currentBossIndex: 0,
    };

    const mockBoss = {
        bossId: 5,
        bossName: "Dark Lord",
        healthPoints: 1000,
        bossPower: 50,
        bossRewardExp: 200,
        bossRageBar: 10,
        bossImg: "dark-lord.png",
        initiallyOverdue: ["task-o1", "task-o2"],
    };

    it("must return the initial state when an undefined state is passed", () => {
        expect(
            bossBattleReducer(undefined, { type: "UNKNOWN_ACTION" })
        ).toEqual(initialState);
    });

    it("must correctly set the active boss", () => {
        const expectedState = {
            ...initialState,
            bossId: mockBoss.bossId,
            bossName: mockBoss.bossName,
            healthPoints: mockBoss.healthPoints,
            maxHealth: mockBoss.healthPoints,
            bossPower: mockBoss.bossPower,
            bossRewardExp: mockBoss.bossRewardExp,
            bossRageBar: mockBoss.bossRageBar,
            bossImg: mockBoss.bossImg,
            rage: 0,
            alreadyRagedTaskIds: mockBoss.initiallyOverdue,
        };
        expect(
            bossBattleReducer(initialState, setActiveBoss(mockBoss))
        ).toEqual(expectedState);
    });

    it("updateHealthBar should truncate healthPoints to 0 if they are negative", () => {
        const stateWithNegativeHealth = {
            ...initialState,
            healthPoints: -50,
            maxHealth: 100,
        };
        const expectedState = { ...stateWithNegativeHealth, healthPoints: 0 };

        expect(
            bossBattleReducer(stateWithNegativeHealth, updateHealthBar())
        ).toEqual(expectedState);
    });

    it("updateHealthBar should not change healthPoints unless they are negative", () => {
        const stateWithPositiveHealth = {
            ...initialState,
            healthPoints: 50,
            maxHealth: 100,
        };

        expect(
            bossBattleReducer(stateWithPositiveHealth, updateHealthBar())
        ).toEqual(stateWithPositiveHealth);
    });

    it("takeDamage should reduce healthPoints by the specified amount", () => {
        const currentState = {
            ...initialState,
            healthPoints: 100,
            maxHealth: 100,
        };
        const damageAmount = 30;
        const expectedState = { ...currentState, healthPoints: 70 };

        expect(
            bossBattleReducer(currentState, takeDamage(damageAmount))
        ).toEqual(expectedState);
    });

    it("takeDamage should trim healthPoints to 0 if damage exceeds current HP", () => {
        const currentState = {
            ...initialState,
            healthPoints: 20,
            maxHealth: 100,
        };
        const damageAmount = 50;
        const expectedState = { ...currentState, healthPoints: 0 };

        expect(
            bossBattleReducer(currentState, takeDamage(damageAmount))
        ).toEqual(expectedState);
    });

    it("updateRageBar should increase rage by 1 if payload is not specified", () => {
        const currentState = { ...initialState, rage: 5 };
        const expectedState = { ...currentState, rage: 6 };

        expect(bossBattleReducer(currentState, updateRageBar())).toEqual(
            expectedState
        );
    });

    it("updateRageBar should increase rage by the specified amount", () => {
        const currentState = { ...initialState, rage: 5 };
        const amount = 3;
        const expectedState = { ...currentState, rage: 8 };

        expect(bossBattleReducer(currentState, updateRageBar(amount))).toEqual(
            expectedState
        );
    });

    it("markTaskAsRaged should add the task ID to alreadyRagedTaskIds", () => {
        const currentState = {
            ...initialState,
            alreadyRagedTaskIds: ["task-1"],
        };
        const taskId = "task-2";
        const expectedState = {
            ...currentState,
            alreadyRagedTaskIds: ["task-1", "task-2"],
        };

        expect(
            bossBattleReducer(currentState, markTaskAsRaged(taskId))
        ).toEqual(expectedState);
    });

    it("resetRage should reset rage to 0", () => {
        const currentState = { ...initialState, rage: 15 };
        const expectedState = { ...currentState, rage: 0 };

        expect(bossBattleReducer(currentState, resetRage())).toEqual(
            expectedState
        );
    });

    it("resetBoss should reset the state to the initial state and currentBossIndex to 0 if the boss is defeated", () => {
        const currentState = {
            ...initialState,
            bossId: "some-id",
            healthPoints: 50,
            currentBossIndex: 2,
        };

        expect(
            bossBattleReducer(currentState, resetBoss({ defeated: true }))
        ).toEqual(initialState);
    });

    it("resetBoss should reset the state to the initial state and increase currentBossIndex if the boss is not defeated", () => {
        const currentState = {
            ...initialState,
            bossId: "some-id",
            healthPoints: 50,
            currentBossIndex: 2,
        };
        const expectedState = {
            ...initialState,
            currentBossIndex: 3,
        };

        expect(bossBattleReducer(currentState, resetBoss({}))).toEqual(
            expectedState
        );
        expect(
            bossBattleReducer(currentState, resetBoss({ defeated: false }))
        ).toEqual(expectedState);
    });
});
