import { createSlice } from "@reduxjs/toolkit";

const unAuthorizedSlice = createSlice({
  name: "unAuthorized",
  initialState: false,
  reducers: {
    setUnAuthorized: (state, action) => action.payload,
  },
});

export const { setUnAuthorized } = unAuthorizedSlice.actions;
export default unAuthorizedSlice.reducer;
