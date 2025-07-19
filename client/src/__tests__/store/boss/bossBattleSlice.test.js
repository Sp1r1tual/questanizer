import reducer, {
    setBossLoading,
    setActiveBoss,
    setBossProgress,
    markTaskAsRaged,
    resetBoss,
    clearBossState,
    setBossEvent,
} from "../../../store/boss/bossBattleSlice";

import { fetchBoss } from "../../../store/boss/bossBattleThunks";

const initialState = {
    bossId: null,
    bossName: null,
    healthPoints: 0,
    maxHealthPoints: 0,
    bossPower: 0,
    bossRewardExp: 0,
    bossRageBar: 0,
    rage: 0,
    bossImg: null,
    alreadyRagedTaskIds: [],
    currentBossIndex: 0,
    loading: false,
    error: null,
    userBossProgress: {
        currentBossIndex: 0,
        lastDefeatedBossId: 0,
        totalBossesDefeated: 0,
        nextBossId: 1,
    },
};

describe("bossBattleSlice", () => {
    it("should return initial state", () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it("setBossLoading sets loading state", () => {
        const state = reducer(initialState, setBossLoading(true));

        expect(state.loading).toBe(true);
    });

    it("setBossProgress sets userBossProgress", () => {
        const progress = {
            currentBossIndex: 2,
            lastDefeatedBossId: 1,
            totalBossesDefeated: 1,
            nextBossId: 2,
        };
        const state = reducer(initialState, setBossProgress(progress));

        expect(state.userBossProgress).toEqual(progress);
    });

    it("setBossEvent sets event", () => {
        const state = reducer(initialState, setBossEvent("BOSS_ENRAGED"));

        expect(state.event).toBe("BOSS_ENRAGED");
    });

    it("markTaskAsRaged adds task ID if not already present", () => {
        const taskId = "task123";
        const state = reducer(initialState, markTaskAsRaged(taskId));

        expect(state.alreadyRagedTaskIds).toContain(taskId);
    });

    it("markTaskAsRaged does not duplicate task ID", () => {
        const taskId = "task123";
        const preState = {
            ...initialState,
            alreadyRagedTaskIds: [taskId],
        };
        const state = reducer(preState, markTaskAsRaged(taskId));

        expect(state.alreadyRagedTaskIds).toEqual([taskId]);
    });

    it("resetBoss resets all boss data but keeps userBossProgress", () => {
        const modifiedState = {
            ...initialState,
            bossId: 10,
            healthPoints: 50,
            userBossProgress: {
                currentBossIndex: 3,
                lastDefeatedBossId: 2,
                totalBossesDefeated: 2,
                nextBossId: 3,
            },
        };
        const state = reducer(modifiedState, resetBoss());

        expect(state.bossId).toBeNull();
        expect(state.healthPoints).toBe(0);
        expect(state.userBossProgress).toEqual(modifiedState.userBossProgress);
    });

    it("clearBossState resets everything to initial", () => {
        const modifiedState = { ...initialState, bossId: 5, rage: 100 };
        const state = reducer(modifiedState, clearBossState());

        expect(state).toEqual(initialState);
    });

    it("setActiveBoss sets all boss data", () => {
        const bossData = {
            bossId: 1,
            bossName: "Dragon",
            healthPoints: 100,
            maxHealthPoints: 100,
            bossPower: 25,
            bossRewardExp: 50,
            bossRageBar: 20,
            bossImg: "img.png",
            initiallyOverdue: ["task1"],
            currentBossIndex: 2,
            userBossProgress: {
                currentBossIndex: 2,
                lastDefeatedBossId: 1,
                totalBossesDefeated: 1,
                nextBossId: 2,
            },
        };
        const state = reducer(initialState, setActiveBoss(bossData));

        expect(state.bossId).toBe(1);
        expect(state.bossName).toBe("Dragon");
        expect(state.rage).toBe(0);
        expect(state.alreadyRagedTaskIds).toEqual(["task1"]);
        expect(state.currentBossIndex).toBe(2);
        expect(state.userBossProgress.totalBossesDefeated).toBe(1);
    });

    describe("fetchBoss thunk", () => {
        it("handles fetchBoss.pending", () => {
            const state = reducer(initialState, {
                type: fetchBoss.pending.type,
            });

            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
        });

        it("handles fetchBoss.fulfilled with boss data", () => {
            const payload = {
                userBossProgress: {
                    currentBossIndex: 2,
                    lastDefeatedBossId: 1,
                    totalBossesDefeated: 1,
                    nextBossId: 3,
                },
                boss: {
                    bossId: 2,
                    bossName: "Skeleton King",
                    healthPoints: 150,
                    maxHealthPoints: 150,
                    bossPower: 30,
                    bossRewardExp: 60,
                    bossRageBar: 25,
                    bossImg: "sk.png",
                    rage: 10,
                    alreadyRagedTaskIds: ["taskX"],
                    currentBossIndex: 2,
                },
            };

            const state = reducer(initialState, {
                type: fetchBoss.fulfilled.type,
                payload,
            });

            expect(state.loading).toBe(false);
            expect(state.bossName).toBe("Skeleton King");
            expect(state.userBossProgress.totalBossesDefeated).toBe(1);
            expect(state.rage).toBe(10);
        });

        it("handles fetchBoss.rejected", () => {
            const action = {
                type: fetchBoss.rejected.type,
                payload: "Fetch error",
            };
            const state = reducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe("Fetch error");
        });
    });
});
