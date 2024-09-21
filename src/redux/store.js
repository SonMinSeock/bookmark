import { configureStore } from "@reduxjs/toolkit";
import bookmarkReducer from "./bookmarkSlice";
import guideBookReducer from "./guideBookSlice"; // 가이드북 슬라이스 임포트
import authReducer from "./authSlice"; // auth 슬라이스 임포트
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 로컬 스토리지 사용
import { combineReducers } from "redux";

// persist 설정
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["bookmarks", "auth"], // 북마크와 auth 상태를 영속화
};

// 여러 리듀서를 합침
const rootReducer = combineReducers({
  bookmarks: bookmarkReducer,
  guideBook: guideBookReducer,
  auth: authReducer,
});

// persistReducer로 영속화 적용
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 스토어 생성
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist 관련 직렬화 오류 방지
    }),
});

export const persistor = persistStore(store); // persistor 추가

export default store;
