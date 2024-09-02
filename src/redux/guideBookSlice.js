import { createSlice } from "@reduxjs/toolkit";

const guideBookSlice = createSlice({
  name: "guideBook",
  initialState: {
    books: [], // 가이드북 리스트
  },
  reducers: {
    addGuideBook: (state, action) => {
      state.books.push(action.payload); // 새로운 가이드북 추가
    },
    removeGuideBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload); // 가이드북 삭제
    },
  },
});

export const { addGuideBook, removeGuideBook } = guideBookSlice.actions;

export default guideBookSlice.reducer;
