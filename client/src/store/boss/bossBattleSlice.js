import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BossService } from "../../services/bossService";

export const fetchBoss = createAsyncThunk(
    "boss/fetchBoss",
    async (_, thunkAPI) => {
        try {
            const response = await BossService.getBoss();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Boss not found");
        }
    }
);

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
        resetBoss: (state, action) => {
            const currentProgress = state.userBossProgress;

            return {
                ...initialState,
                userBossProgress: currentProgress,
            };
        },
        setBossEvent: (state, action) => {
            state.event = action.payload;
        },
        clearBossState: () => initialState,
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

                if (!response.boss) {
                    return;
                }

                const boss = response.boss;

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
    setActiveBoss,
    setBossProgress,
    markTaskAsRaged,
    resetBoss,
    clearBossState,
} = bossBattleSlice.actions;

export default bossBattleSlice.reducer;
