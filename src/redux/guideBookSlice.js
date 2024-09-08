import { createSlice } from "@reduxjs/toolkit";

const guideBookSlice = createSlice({
  name: "guideBook",
  initialState: {
    books: [], // 가이드북 리스트를 저장할 초기 상태
  },
  reducers: {
    setGuideBooks: (state, action) => {
      state.books = action.payload; // 전달된 가이드북 데이터를 상태에 저장
    },
    addGuideBook: (state, action) => {
      state.books.push(action.payload); // 새로운 가이드북을 추가
    },
    removeGuideBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload); // 가이드북을 제거
    },
  },
});

export const updateGuideBookDays = (id, days) => ({
  type: "guideBook/updateDays",
  payload: { id, days },
});

export const { setGuideBooks, addGuideBook, removeGuideBook } = guideBookSlice.actions;

export default guideBookSlice.reducer;
