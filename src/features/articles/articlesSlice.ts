import { createSlice } from "@reduxjs/toolkit";

import { DocumentData } from "firebase/firestore";

// Define a type for the slice state
interface ArticleState {
  allSpots: DocumentData[] | null;
  selectSpots: DocumentData[] | null;
  area: string;
  breaks: string;
  difficulty: string;
}

// Define the initial state using that type
const initialState: ArticleState = {
  allSpots: null,
  selectSpots: null,
  area: "all",
  breaks: "all",
  difficulty: "all",
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setAllSpots: (state, action) => {
      state.allSpots = action.payload;
    },
    setSelectSpots: (state, action) => {
      state.selectSpots = action.payload;
    },
    setArea: (state, action) => {
      state.area = action.payload;
    },
    setBreaks: (state, action) => {
      state.breaks = action.payload;
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload;
    },
  },
});

// export single reducer
export const {
  setAllSpots,
  setSelectSpots,
  setArea,
  setBreaks,
  setDifficulty,
} = articlesSlice.actions;

// export slice.reducer
export default articlesSlice.reducer;
