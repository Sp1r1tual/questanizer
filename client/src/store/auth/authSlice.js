import { createSlice } from "@reduxjs/toolkit";
import { login, register, logout, checkAuth } from "./authThunks";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAuthChecked: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.isAuthChecked = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isAuthChecked = true;
                state.error = action.payload;
            })

            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.isAuthChecked = true;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isAuthChecked = true;
                state.error = action.payload;
            })

            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isAuthChecked = true;
                state.error = null;
            })

            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.isAuthChecked = true;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isAuthChecked = true;
                state.error = action.payload;
            });
    },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
