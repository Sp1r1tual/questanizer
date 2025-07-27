import { createSlice } from "@reduxjs/toolkit";
import { fetchFaqs } from "./faqThunks";

const faqSlice = createSlice({
    name: "faq",
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFaqs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFaqs.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchFaqs.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    },
});

export default faqSlice.reducer;
