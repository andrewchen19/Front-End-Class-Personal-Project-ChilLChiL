import { createSlice } from "@reduxjs/toolkit";

type UnsplashObject = {
  [key: string]: any;
};

// Define a type for the slice state
interface ArticleState {
  isUnsplashOpen: boolean;
  cover: string;
  unsplashArray: UnsplashObject[];
}

// Define the initial state using that type
const initialState: ArticleState = {
  isUnsplashOpen: false,
  cover: "",
  unsplashArray: [],
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
  },
});

// export single reducer
export const {
  openUnsplash,
  closeUnsplash,
  setUnsplashData,
  resetUnsplashData,
  setCover,
  resetCover,
} = articleSlice.actions;

// export slice.reducer
export default articleSlice.reducer;
