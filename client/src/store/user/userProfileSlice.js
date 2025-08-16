import { createSlice } from "@reduxjs/toolkit";

import { fetchUserProfile, updateUserProfile } from "./userProfileThunks";

import { normalizeUserProfile } from "@/utils/store/user/normalizeUserProfile";

const initialState = {
    profile: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserProfileState(state) {
            state.profile = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = normalizeUserProfile(action.payload);
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = normalizeUserProfile(action.payload);
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearUserProfileState } = userSlice.actions;

export default userSlice.reducer;
