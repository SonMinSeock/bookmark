import { createSlice } from "@reduxjs/toolkit";

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: [],
  reducers: {
    addBookmark: (state, action) => {
      state.push(action.payload);
    },
    removeBookmark: (state, action) => {
      return state.filter((item) => item.contentid.contentId !== action.payload);
    },
    resetBookmarks: (state) => {
      return []; // 모든 북마크를 초기화합니다.
    },
  },
});

export const { addBookmark, removeBookmark, resetBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
