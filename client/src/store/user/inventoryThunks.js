import { createAsyncThunk } from "@reduxjs/toolkit";

import { InventoryService } from "@/services/inventoryService";

import { fetchStats } from "../stats/userStatsThunks";

const fetchInventory = createAsyncThunk("inventory/fetchInventory", async (_, thunkAPI) => {
  try {
    const response = await InventoryService.getInventory();

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to load inventory");
  }
});

const applyInventoryItem = createAsyncThunk(
  "inventory/applyInventoryItem",
  async ({ itemId }, thunkAPI) => {
    try {
      const response = await InventoryService.applyInventoryItem({
        itemId,
      });

      thunkAPI.dispatch(fetchStats());
      thunkAPI.dispatch(fetchInventory());

      return response.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to use item in inventory");
    }
  },
);

export { fetchInventory, applyInventoryItem };
