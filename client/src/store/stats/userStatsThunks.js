import { createAsyncThunk } from "@reduxjs/toolkit";

import { StatsService } from "@/services/statsService";

const fetchStats = createAsyncThunk("stats/fetchStats", async () => {
  const response = await StatsService.getStats();

  return response.data;
});

const resetStats = createAsyncThunk("stats/reset", async (_, thunkAPI) => {
  try {
    const response = await StatsService.resetStats();

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to reset stats");
  }
});

export { fetchStats, resetStats };
