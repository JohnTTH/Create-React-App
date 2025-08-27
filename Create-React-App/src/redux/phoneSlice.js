import { createSlice } from "@reduxjs/toolkit";

const phoneSlice = createSlice({
  name: "phone",
  initialState: {
    value: "",
  },
  reducers: {
    setPhone: (state, action) => {
      state.value = action.payload;
    },
  }
});

export const { setPhone } = phoneSlice.actions;
export default phoneSlice.reducer;
