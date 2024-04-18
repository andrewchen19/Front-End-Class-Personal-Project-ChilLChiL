import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import articleReducer from "./features/article/articleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    article: articleReducer,
  },
});
export type IRootState = ReturnType<typeof store.getState>;
