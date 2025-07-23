import { createSlice } from "@reduxjs/toolkit";
import { fetchUserProfile, updateUserProfile } from "./userThunks";

const initialState = {
    profile: null,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserProfile(state) {
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

                const data = action.payload;

                state.profile = {
                    name: data.username || "No name",
                    level: data.stats?.level ?? null,
                    health: data.stats?.hp ?? null,
                    registrationDate: data.stats?.createdAt || null,
                    bio: data.bio || "",
                    photoUrl: data.photoUrl || null,
                };
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                const data = action.payload;

                state.profile = {
                    name: data.username || "No name",
                    level: data.stats?.level ?? null,
                    health: data.stats?.hp ?? null,
                    registrationDate: data.stats?.createdAt || null,
                    bio: data.bio || "",
                    photoUrl: data.photoUrl || null,
                };
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearUserProfile } = userSlice.actions;

export default userSlice.reducer;
