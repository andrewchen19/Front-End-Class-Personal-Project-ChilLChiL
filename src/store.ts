import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import articleReducer from "./features/article/articleSlice";
import articlesReducer from "./features/articles/articlesSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    article: articleReducer,
    articles: articlesReducer,
  },
});
export type IRootState = ReturnType<typeof store.getState>;
