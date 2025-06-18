import { createSlice } from "@reduxjs/toolkit";

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

const bossBattleSlice = createSlice({
    name: "bossBattle",
    initialState,
    reducers: {
        setActiveBoss: (state, action) => {
            const boss = action.payload;

            state.bossId = boss.bossId;
            state.bossName = boss.bossName;
            state.healthPoints = boss.healthPoints;
            state.maxHealth = boss.healthPoints;
            state.bossPower = boss.bossPower;
            state.bossRewardExp = boss.bossRewardExp;
            state.bossRageBar = boss.bossRageBar;
            state.bossImg = boss.bossImg;
            state.rage = 0;
            state.alreadyRagedTaskIds = boss.initiallyOverdue ?? []; // filters overdue tasks before activating the boss
        },
        updateHealthBar: (state) => {
            if (state.healthPoints < 0) state.healthPoints = 0;
        },
        takeDamage: (state, action) => {
            state.healthPoints = Math.max(
                0,
                state.healthPoints - action.payload
            );
        },
        updateRageBar: (state, action) => {
            const amount = action.payload ?? 1;

            state.rage += amount;
        },
        markTaskAsRaged: (state, action) => {
            state.alreadyRagedTaskIds = [
                ...state.alreadyRagedTaskIds,
                action.payload,
            ];
        },
        resetRage: (state) => {
            state.rage = 0;
        },
        resetBoss: (state, action) => {
            const { defeated } = action.payload || {};

            return defeated
                ? { ...initialState, currentBossIndex: 0 }
                : {
                      ...initialState,
                      currentBossIndex: state.currentBossIndex + 1,
                  };
        },
    },
});

export const {
    setActiveBoss,
    updateHealthBar,
    takeDamage,
    updateRageBar,
    setOverdueTasksCount,
    attackUser,
    rewardUser,
    resetBoss,
    markTaskAsRaged,
    resetRage,
} = bossBattleSlice.actions;

export default bossBattleSlice.reducer;
