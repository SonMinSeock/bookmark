import { configureStore } from "@reduxjs/toolkit";
import exampleSlice from "./slice";

export const store = configureStore({
  reducer: {
    example: exampleSlice,
  },
});
