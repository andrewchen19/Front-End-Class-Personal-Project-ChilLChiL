import { createSlice } from "@reduxjs/toolkit";

type UnsplashObject = {
  [key: string]: any;
};

// Define a type for the slice state
interface ArticleState {
  isUnsplashOpen: boolean;
  cover: string;
  unsplashArray: UnsplashObject[];
  photographerLink: string;
  photographerName: string;
  isCommentOpen: boolean;
  typeText: string;
  searchText: string;
  page: number;
}

// Define the initial state using that type
const initialState: ArticleState = {
  isUnsplashOpen: false,
  cover: "",
  unsplashArray: [],
  photographerLink: "",
  photographerName: "",
  isCommentOpen: false,
  typeText: "",
  searchText: "",
  page: 1,
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    openUnsplash: (state) => {
      state.isUnsplashOpen = true;
      state.typeText = "";
      state.searchText = "";
      state.page = 1;
    },
    closeUnsplash: (state) => {
      state.isUnsplashOpen = false;
      state.typeText = "";
      state.searchText = "";
      state.page = 1;
    },
    setUnsplashData: (state, action) => {
      const data = action.payload;
      state.unsplashArray = data;
    },
    resetUnsplashData: (state) => {
      state.unsplashArray = [];
    },
    setCover: (state, action) => {
      const url = action.payload;
      state.cover = url;
    },
    resetCover: (state) => {
      state.cover = "";
    },
    setPhotographer: (state, action) => {
      const { link, name } = action.payload;
      state.photographerLink = link;
      state.photographerName = name;
    },
    openComment: (state) => {
      state.isCommentOpen = true;
    },
    closeComment: (state) => {
      state.isCommentOpen = false;
    },
    setTypeText: (state, action) => {
      state.typeText = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

// export single reducer
export const {
  openUnsplash,
  closeUnsplash,
  setUnsplashData,
  resetUnsplashData,
  setCover,
  setPhotographer,
  resetCover,
  openComment,
  closeComment,
  setTypeText,
  setSearchText,
  setPage,
} = articleSlice.actions;

// export slice.reducer
export default articleSlice.reducer;
