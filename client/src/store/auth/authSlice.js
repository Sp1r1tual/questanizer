import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthService } from "../../services/authService";
import { API_URL } from "../../http";

const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem("token", response.data.accessToken);
            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

const register = createAsyncThunk(
    "auth/register",
    async (credentials, thunkAPI) => {
        try {
            const response = await AuthService.registration(credentials);
            localStorage.setItem("token", response.data.accessToken);
            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
    localStorage.removeItem("token");
});

const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/refresh`, {
            withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return response.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Session expired"
        );
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isAuthChecked: false,
    },
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
                state.error = null;
                state.isLoading = false;
                state.isAuthChecked = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isAuthChecked = true;
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                state.isLoading = false;
                state.isAuthChecked = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.isAuthChecked = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
                state.isAuthChecked = true;
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
                state.isLoading = false;
                state.isAuthChecked = true;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
                state.isLoading = false;
                state.isAuthChecked = true;
            });
    },
});

export { login, register, logout, checkAuth };
export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
