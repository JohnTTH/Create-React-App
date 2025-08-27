import { configureStore } from "@reduxjs/toolkit";
import phoneReducer from "./phoneSlice";
import emailReducer from "./emailSlice"

export const store = configureStore({
  reducer: {
    phone: phoneReducer,
    email: emailReducer,
  },
});
