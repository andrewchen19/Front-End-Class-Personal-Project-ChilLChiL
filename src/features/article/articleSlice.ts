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
}

// Define the initial state using that type
const initialState: ArticleState = {
  isUnsplashOpen: false,
  cover: "",
  unsplashArray: [],
  photographerLink: "",
  photographerName: "",
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    openUnsplash: (state) => {
      state.isUnsplashOpen = true;
    },
    closeUnsplash: (state) => {
      state.isUnsplashOpen = false;
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
} = articleSlice.actions;

// export slice.reducer
export default articleSlice.reducer;
