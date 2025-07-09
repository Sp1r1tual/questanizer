import { createAsyncThunk } from "@reduxjs/toolkit";
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
