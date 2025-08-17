import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { AuthService } from "@/services/authService";
import { API_URL } from "@/http";

import { syncUserLanguage } from "@/utils/state/syncUserLanguage";

const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await AuthService.login(email, password);

            localStorage.setItem("token", response.data.accessToken);

            await syncUserLanguage(thunkAPI);

            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue("errors.auth.login");
        }
    }
);

const register = createAsyncThunk(
    "auth/register",
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await AuthService.registration(email, password);

            localStorage.setItem("token", response.data.accessToken);

            return response.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue("errors.auth.registration");
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
        return thunkAPI.rejectWithValue("errors.auth.expired");
    }
});

export { login, register, logout, checkAuth };
