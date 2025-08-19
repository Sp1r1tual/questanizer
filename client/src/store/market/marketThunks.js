import { createAsyncThunk } from "@reduxjs/toolkit";

import { MarketService } from "@/services/marketService";

import { fetchStats } from "../stats/userStatsThunks";
import { fetchInventory } from "../user/inventoryThunks";

const fetchMarket = createAsyncThunk("market/fetchMarket", async (_, thunkAPI) => {
  try {
    const response = await MarketService.getMarket();

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to load market");
  }
});

const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const response = await MarketService.getCart();

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to load cart");
  }
});

const addToCart = createAsyncThunk("cart/addToCart", async ({ itemId, quantity = 1 }, thunkAPI) => {
  try {
    const response = await MarketService.addToCart({
      itemId,
      quantity,
    });

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to add item in cart");
  }
});

const checkoutCart = createAsyncThunk("cart/checkoutCart", async (_, thunkAPI) => {
  try {
    const response = await MarketService.checkoutCart();

    thunkAPI.dispatch(fetchStats());
    thunkAPI.dispatch(fetchInventory());

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to checkout cart");
  }
});

const syncCart = createAsyncThunk("cart/syncCart", async (items, thunkAPI) => {
  try {
    const response = await MarketService.syncCart(items);

    return response.data;
  } catch {
    return thunkAPI.rejectWithValue("Failed to sync cart");
  }
});

export { fetchMarket, fetchCart, addToCart, checkoutCart, syncCart };
