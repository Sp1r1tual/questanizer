import { createSlice } from "@reduxjs/toolkit";
import {
    fetchMarket,
    fetchCart,
    addToCart,
    checkoutCart,
    removeFromCart,
} from "./marketThunks";

const initialState = {
    marketItems: [],
    cart: [],
    isLoading: false,
    error: null,
    checkoutResult: null,
    isCartModalOpen: false,
    isItemModalOpen: false,
    selectedItem: null,
};

const marketSlice = createSlice({
    name: "market",
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        clearCheckoutResult(state) {
            state.checkoutResult = null;
        },
        openCartModal(state) {
            state.isCartModalOpen = true;
        },
        closeCartModal(state) {
            state.isCartModalOpen = false;
        },
        openItemModal(state, action) {
            state.isItemModalOpen = true;
            state.selectedItem = action.payload;
        },
        closeItemModal(state) {
            state.isItemModalOpen = false;
            state.selectedItem = null;
        },
        clearMarketState: () => ({ ...initialState }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarket.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMarket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.marketItems = action.payload;
            })
            .addCase(fetchMarket.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload?.items || [];
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload?.items || [];
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(checkoutCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.checkoutResult = null;
            })
            .addCase(checkoutCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = [];
                state.checkoutResult = action.payload;
            })
            .addCase(checkoutCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload?.items || [];
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearError,
    clearCheckoutResult,
    openItemModal,
    closeItemModal,
    openCartModal,
    closeCartModal,
    clearMarketState,
} = marketSlice.actions;

export default marketSlice.reducer;
