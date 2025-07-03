import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StatsService } from "../../services/statsService";

export const fetchStats = createAsyncThunk("stats/fetchStats", async () => {
    const response = await StatsService.getStats();

    return response.data;
});

const statsSlice = createSlice({
    name: "stats",
    initialState: {
        experience: 0,
        level: 1,
        health: 100,
        maxHealth: 100,
    },
    reducers: {
        resetStats: (state) => {
            state.experience = 0;
            state.level = 1;
            state.health = 100;
            state.maxHealth = 100;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStats.fulfilled, (state, action) => {
            state.experience = action.payload.xp;
            state.level = action.payload.level;
            state.health = action.payload.hp;
            state.maxHealth = action.payload.maxHp;
        });
    },
});

export const { resetStats } = statsSlice.actions;

export default statsSlice.reducer;
