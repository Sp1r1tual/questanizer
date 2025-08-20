import { createSlice } from "@reduxjs/toolkit";

import { fetchStats, resetStats } from "./userStatsThunks";

const initialState = {
  experience: 0,
  level: 1,
  health: 100,
  maxHealth: 100,
  gold: 0,
  loaded: false,
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
        state.gold = action.payload.gold;
        state.loaded = true;
      })

      .addCase(resetStats.fulfilled, (state, action) => {
        const stats = action.payload.stats;

        state.experience = stats.xp;
        state.level = stats.level;
        state.health = stats.hp;
        state.maxHealth = stats.maxHp;
        state.gold = stats.gold;
      });
  },
});

export const { clearStatsState } = statsSlice.actions;

export default statsSlice.reducer;
