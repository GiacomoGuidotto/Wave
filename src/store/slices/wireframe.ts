import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxState } from "store/store";
import { Categories } from "globals/globals_types";

// wireframe slice type
export interface wireframeState {
  accessRightPage: boolean;
  homeMenuOpen: boolean;
  homeSearchOpen: boolean;
  homeDropdownOpen: boolean;
  homeUsersOpen: boolean;
  homeCategory: Categories;
  homeChat: string;
}

// wireframe slice initial state
const initialState: wireframeState = {
  accessRightPage: false,
  homeMenuOpen: false,
  homeSearchOpen: false,
  homeDropdownOpen: false,
  homeUsersOpen: false,
  homeCategory: "contacts",
  homeChat: "",
};

// redux store partition ("slice") for the wireframe state management
export const wireframeSlice = createSlice({
  name: "wireframe",
  initialState,
  reducers: {
    updateAccessRightPage: (state, action: PayloadAction<boolean>) => {
      state.accessRightPage = action.payload;
    },
    updateHomeMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.homeMenuOpen = action.payload;
    },
    updateHomeSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.homeSearchOpen = action.payload;
    },
    updateHomeDropdownOpen: (state, action: PayloadAction<boolean>) => {
      state.homeDropdownOpen = action.payload;
    },
    updateHomeUsersOpen: (state, action: PayloadAction<boolean>) => {
      state.homeUsersOpen = action.payload;
    },
    updateHomeCategory: (state, action: PayloadAction<Categories>) => {
      state.homeCategory = action.payload;
    },
    updateHomeChat: (state, action: PayloadAction<string>) => {
      state.homeChat = action.payload;
    },
    updateState: (state, action: PayloadAction<wireframeState>) => {
      state.accessRightPage = action.payload.accessRightPage;
      state.homeMenuOpen = action.payload.homeMenuOpen;
      state.homeSearchOpen = action.payload.homeSearchOpen;
      state.homeDropdownOpen = action.payload.homeDropdownOpen;
      state.homeUsersOpen = action.payload.homeUsersOpen;
      state.homeCategory = action.payload.homeCategory;
      state.homeChat = action.payload.homeChat;
    },
    resetWireframe: (state) => {
      state.accessRightPage = false;
      state.homeMenuOpen = false;
      state.homeSearchOpen = false;
      state.homeDropdownOpen = false;
      state.homeUsersOpen = false;
      state.homeCategory = "contacts";
      state.homeChat = "";
    },
  },
});

export const {
  updateAccessRightPage,
  updateHomeMenuOpen,
  updateHomeSearchOpen,
  updateHomeDropdownOpen,
  updateHomeUsersOpen,
  updateHomeCategory,
  updateHomeChat,
  updateState,
  resetWireframe,
} = wireframeSlice.actions;

export const retrieveAccessRightPage = (state: ReduxState) =>
  state.wireframe.accessRightPage;
export const retrieveHomeMenuOpen = (state: ReduxState) =>
  state.wireframe.homeMenuOpen;
export const retrieveHomeSearchOpen = (state: ReduxState) =>
  state.wireframe.homeSearchOpen;
export const retrieveHomeDropdownOpen = (state: ReduxState) =>
  state.wireframe.homeDropdownOpen;
export const retrieveHomeUsersOpen = (state: ReduxState) =>
  state.wireframe.homeUsersOpen;
export const retrieveHomeCategory = (state: ReduxState): Categories =>
  state.wireframe.homeCategory;
export const retrieveHomeChat = (state: ReduxState) => state.wireframe.homeChat;
export const retrieveWireframe = (state: ReduxState) => state.wireframe;

// serve the reducers for the store configuration in "../store.ts"
export default wireframeSlice.reducer;
