import { createSlice } from "@reduxjs/toolkit";

import {
  login,
  register,
  logout,
  checkAuth,
  requestForgotPassword,
  requestResetPassword,
} from "./authThunks";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: false,
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
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload;
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
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.isAuthChecked = true;
        state.error = action.payload;
      })

      .addCase(requestForgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestForgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload;
        state.cooldown = 60;
      })
      .addCase(requestForgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = null;
      })

      .addCase(requestResetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestResetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.message = action.payload;
      })
      .addCase(requestResetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { clearAuthError, setIsAuthenticated, setAuthChecked } = authSlice.actions;

export default authSlice.reducer;
