import { createAsyncThunk } from "@reduxjs/toolkit";

import { UserService } from "@/services/userService";

const fetchPublicUserProfile = createAsyncThunk(
  "publicUser/fetchPublicUserProfile",
  async (userId, thunkAPI) => {
    try {
      const response = await UserService.getUserPublicProfile(userId);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile",
      );
    }
  },
);

export { fetchPublicUserProfile };
