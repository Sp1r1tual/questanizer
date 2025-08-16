import { createAsyncThunk } from "@reduxjs/toolkit";

import { UserService } from "@/services/userService";

const fetchUserProfile = createAsyncThunk(
    "user/fetchUserProfile",
    async (_, thunkAPI) => {
        try {
            const response = await UserService.fetchUserProfile();

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);

const updateUserProfile = createAsyncThunk(
    "user/updateUserProfile",
    async (data, thunkAPI) => {
        try {
            const response = await UserService.updateUserProfile(data);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);

export { fetchUserProfile, updateUserProfile };
