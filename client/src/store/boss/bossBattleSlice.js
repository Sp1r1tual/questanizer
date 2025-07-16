import { createSlice } from "@reduxjs/toolkit";
import { fetchBoss } from "./bossBattleThunks";

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

const bossBattleSlice = createSlice({
    name: "bossBattle",
    initialState,
    reducers: {
        setBossLoading: (state, action) => {
            state.loading = action.payload;
        },
        setActiveBoss: (state, action) => {
            const boss = action.payload;

            state.bossId = boss.bossId;
            state.bossName = boss.bossName;
            state.healthPoints = boss.healthPoints;
            state.maxHealthPoints = boss.maxHealthPoints;
            state.bossPower = boss.bossPower;
            state.bossRewardExp = boss.bossRewardExp;
            state.bossRageBar = boss.bossRageBar;
            state.bossImg = boss.bossImg;
            state.rage = 0;
            state.alreadyRagedTaskIds = boss.initiallyOverdue ?? [];
            state.currentBossIndex = boss.currentBossIndex || 0;

            if (boss.userBossProgress) {
                state.userBossProgress = boss.userBossProgress;
            }
        },
        setBossProgress: (state, action) => {
            state.userBossProgress = action.payload;
        },
        markTaskAsRaged: (state, action) => {
            const taskId = action.payload;

            if (!state.alreadyRagedTaskIds.includes(taskId)) {
                state.alreadyRagedTaskIds.push(taskId);
            }
        },
        resetBoss: (state) => {
            const currentProgress = state.userBossProgress;

            return {
                ...initialState,
                userBossProgress: currentProgress,
            };
        },
        clearBossState: () => initialState,
        setBossEvent: (state, action) => {
            state.event = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoss.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBoss.fulfilled, (state, action) => {
                const response = action.payload;

                state.loading = false;
                state.userBossProgress =
                    response?.userBossProgress || initialState.userBossProgress;

                const boss = response.boss;

                if (!boss) return;

                state.bossId = boss.bossId;
                state.bossName = boss.bossName;
                state.healthPoints = boss.healthPoints;
                state.maxHealthPoints = boss.maxHealthPoints;
                state.bossPower = boss.bossPower;
                state.bossRewardExp = boss.bossRewardExp;
                state.bossRageBar = boss.bossRageBar;
                state.bossImg = boss.bossImg;
                state.rage = boss.rage || 0;
                state.alreadyRagedTaskIds = boss.alreadyRagedTaskIds || [];
                state.currentBossIndex = boss.currentBossIndex || 0;
            })
            .addCase(fetchBoss.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setBossLoading,
    setActiveBoss,
    setBossProgress,
    markTaskAsRaged,
    resetBoss,
    clearBossState,
    setBossEvent,
} = bossBattleSlice.actions;

export default bossBattleSlice.reducer;
