import { createAsyncThunk } from "@reduxjs/toolkit";

import { LocalizationService } from "@/services/localizationService";

import { fetchLanguage } from "@/utils/state/fetchLanguage";

const fetchUserLanguage = createAsyncThunk(
    "localization/fetchUserLanguage",
    async (_, thunkAPI) => {
        try {
            const response = await LocalizationService.getUserLanguage();

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to load user language");
        }
    }
);

const changeUserLanguage = createAsyncThunk(
    "localization/changeUserLanguage",
    async (language, thunkAPI) => {
        try {
            const response = await LocalizationService.changeUserLanguage(
                language
            );

            fetchLanguage(thunkAPI.dispatch);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to change user language");
        }
    }
);

export { fetchUserLanguage, changeUserLanguage };
