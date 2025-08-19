import { createSlice } from "@reduxjs/toolkit";

import { fetchMarket, fetchCart, addToCart, checkoutCart, syncCart } from "./marketThunks";

const initialState = {
  marketItems: [],
  cart: [],
  isLoading: false,
  error: null,
  checkoutResult: null,
  isCartModalOpen: false,
  isItemModalOpen: false,
  selectedItem: null,
  localCartQuantities: {},
  isCartLoaded: false,
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
    setLocalCartQuantity(state, action) {
      const { itemId, quantity } = action.payload;

      state.localCartQuantities[itemId] = quantity;
    },
    removeLocalCartQuantity(state, action) {
      delete state.localCartQuantities[action.payload];
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
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload?.items || [];
        state.isCartLoaded = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.isCartLoaded = true;
      })

      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload?.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(syncCart.pending, (state) => {
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.cart = action.payload?.items || [];
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(checkoutCart.pending, (state) => {
        state.error = null;
        state.checkoutResult = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.cart = [];
        state.checkoutResult = action.payload;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearCheckoutResult,
  openItemModal,
  setLocalCartQuantity,
  removeLocalCartQuantity,
  closeItemModal,
  openCartModal,
  closeCartModal,
  clearMarketState,
} = marketSlice.actions;

export default marketSlice.reducer;
