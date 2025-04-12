import { createSlice } from "@reduxjs/toolkit";

const isRefreshingSlice = createSlice({
  name: "isRefreshing",
  initialState: false,
  reducers: {
    setIsRefreshing: (state, action) => action.payload,
  },
});

export const { setIsRefreshing } = isRefreshingSlice.actions;
export default isRefreshingSlice.reducer;