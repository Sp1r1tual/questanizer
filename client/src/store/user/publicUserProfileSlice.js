import { createSlice } from "@reduxjs/toolkit";

import { fetchPublicUserProfile } from "./publicUserProfileThunks";

const publicUserProfileSlice = createSlice({
    name: "publicUser",
    initialState: {
        profile: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearPublicProfileState(state) {
            state.profile = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPublicUserProfile.fulfilled, (state, action) => {
                const data = action.payload;

                state.isLoading = false;
                state.profile = {
                    username: data.username || null,
                    level: data.stats?.level ?? null,
                    health: data.stats?.hp ?? null,
                    registrationDate: data.stats?.createdAt || null,
                    bio: data.bio || "",
                    photoUrl: data.photoUrl || null,
                };
            })
            .addCase(fetchPublicUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPublicProfileState } = publicUserProfileSlice.actions;

export default publicUserProfileSlice.reducer;
