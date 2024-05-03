import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../types";

interface UserState {
  user: null | UserInfo;
  theme: string;
  isEditContainerOpen: boolean;
  isSideBarOpen: boolean;
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
  isEditContainerOpen: false,
  isSideBarOpen: false,
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
      state.isEditContainerOpen = false;
      state.isSideBarOpen = false;
      localStorage.removeItem("user");
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    openEditContainer: (state) => {
      state.isEditContainerOpen = true;
    },
    closeEditContainer: (state) => {
      state.isEditContainerOpen = false;
    },
    toggleSidebar: (state) => {
      const newIsSidebarOpen = !state.isSideBarOpen;
      state.isSideBarOpen = newIsSidebarOpen;
    },
  },
});

// toggleTheme

// export single reducer
export const {
  setUser,
  removeUser,
  openEditContainer,
  closeEditContainer,
  updateUser,
  toggleSidebar,
} = userSlice.actions;

// export slice.reducer
export default userSlice.reducer;
