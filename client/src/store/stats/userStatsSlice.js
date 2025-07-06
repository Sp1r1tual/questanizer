import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StatsService } from "../../services/statsService";

export const fetchStats = createAsyncThunk("stats/fetchStats", async () => {
    const response = await StatsService.getStats();

    return response.data;
});

export const resetStats = createAsyncThunk(
    "stats/reset",
    async (_, thunkAPI) => {
        try {
            const response = await StatsService.resetStats();

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue("Failed to reset stats");
        }
    }
);

const initialState = {
    experience: 0,
    level: 1,
    health: 100,
    maxHealth: 100,
};

const statsSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {
        clearStatsState: () => ({ ...initialState }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.experience = action.payload.xp;
                state.level = action.payload.level;
                state.health = action.payload.hp;
                state.maxHealth = action.payload.maxHp;
            })
            .addCase(resetStats.fulfilled, (state, action) => {
                state.experience = action.payload.xp;
                state.level = action.payload.level;
                state.health = action.payload.hp;
                state.maxHealth = action.payload.maxHp;
            });
    },
});

export const { clearStatsState } = statsSlice.actions;

export default statsSlice.reducer;
