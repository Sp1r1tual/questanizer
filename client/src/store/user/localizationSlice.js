import { createSlice } from "@reduxjs/toolkit";

import { fetchUserLanguage, changeUserLanguage } from "./localizationThunks";

const initialState = {
    language: null,
    loading: false,
    error: null,
};

const localizationSlice = createSlice({
    name: "localization",
    initialState,
    reducers: {
        setLanguage(state, action) {
            state.language = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserLanguage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserLanguage.fulfilled, (state, action) => {
                state.language = action.payload.language;
                state.loading = false;
            })
            .addCase(fetchUserLanguage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(changeUserLanguage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeUserLanguage.fulfilled, (state, action) => {
                state.language = action.payload.language;
                state.loading = false;
            })
            .addCase(changeUserLanguage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setLanguage } = localizationSlice.actions;

export default localizationSlice.reducer;
