import { configureStore } from "@reduxjs/toolkit";
import bookmarkReducer from "./bookmarkSlice";
import guideBookReducer from "./guideBookSlice"; // 가이드북 슬라이스 임포트

const store = configureStore({
  reducer: {
    bookmarks: bookmarkReducer,
    guideBook: guideBookReducer,
  },
});

export default store;
