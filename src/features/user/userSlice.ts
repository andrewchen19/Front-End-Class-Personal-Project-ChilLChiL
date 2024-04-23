import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../types";

interface UserState {
  user: null | UserInfo;
  theme: string;
  isSidebarOpen: boolean;
}

interface Themes {
  light: string;
  dark: string;
}

const themes: Themes = {
  light: "light",
  dark: "dark",
};

const getUserFromLocalStorage = (): null | UserInfo => {
  const userData = localStorage.getItem("user");
  if (userData === null) {
    return null;
  }
  const user = JSON.parse(userData);
  return user;
};

const getThemeFromLocalStorage = (): string => {
  const themeData = localStorage.getItem("theme");
  if (themeData === null) {
    return themes.light;
  }
  const theme = JSON.parse(themeData);
  return theme;
};

const initialState: UserState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
  isSidebarOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      state.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
      };
      state.theme = user.theme;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("theme", JSON.stringify(state.theme));
    },
    removeUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      localStorage.removeItem("user");
    },
  },
});

// updateUser, toggleTheme, toggleSidebar

// export single reducer
export const { setUser, removeUser } = userSlice.actions;

// export slice.reducer
export default userSlice.reducer;
