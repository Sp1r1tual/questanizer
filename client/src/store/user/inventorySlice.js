import { createSlice } from "@reduxjs/toolkit";

import { fetchInventory, applyInventoryItem } from "./inventoryThunks";

const initialState = {
    inventoryItems: [],
    selectedItem: null,
    isLoading: false,
    hasLoaded: false,
    error: null,
    useResult: null,
    isInventoryItemModalOpen: false,
};

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        openInventoryItemModal: (state, action) => {
            state.selectedItem = action.payload;
            state.isInventoryItemModalOpen = true;
        },
        closeInventoryItemModal: (state) => {
            state.selectedItem = null;
            state.isInventoryItemModalOpen = false;
        },
        clearInventoryState: () => ({ ...initialState }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.hasLoaded = true;
                state.isLoading = false;
                state.inventoryItems = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.hasLoaded = true;
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(applyInventoryItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(applyInventoryItem.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload?.inventoryItems) {
                    state.inventoryItems = action.payload.inventoryItems;
                }
            })
            .addCase(applyInventoryItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    openInventoryItemModal,
    closeInventoryItemModal,
    clearInventoryState,
} = inventorySlice.actions;

export default inventorySlice.reducer;
