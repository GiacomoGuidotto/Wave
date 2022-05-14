import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ReduxState } from "store/store";
import { Categories } from "globals/globals_types";

// wireframe slice type
export interface wireframeState {
  accessRightPage: boolean;
  homeMenu: boolean;
  homeCategory: Categories;
  homeChat: string;
}

// user slice initial state
const initialState: wireframeState = {
  accessRightPage: false,
  homeMenu: false,
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
    updateHomeMenu: (state, action: PayloadAction<boolean>) => {
      state.homeMenu = action.payload;
    },
    updateHomeCategory: (state, action: PayloadAction<Categories>) => {
      state.homeCategory = action.payload;
    },
    updateHomeChat: (state, action: PayloadAction<string>) => {
      state.homeChat = action.payload;
    },
    updateState: (state, action: PayloadAction<wireframeState>) => {
      state.accessRightPage = action.payload.accessRightPage;
      state.homeMenu = action.payload.homeMenu;
      state.homeCategory = action.payload.homeCategory;
      state.homeChat = action.payload.homeChat;
    },
  },

  // reducer called after server side rendering,
  // used by the wrapper for pass the state from next server to next client
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.wireframe,
      };
    },
  },
});

// user slice reducers
export const {
  updateAccessRightPage,
  updateHomeMenu,
  updateHomeCategory,
  updateHomeChat,
  updateState,
} = wireframeSlice.actions;

// user slice selectors, for the extract of the single element in the user state
export const retrieveAccessRightPage = (state: ReduxState) =>
  state.wireframe.accessRightPage;
export const retrieveHomeMenu = (state: ReduxState) => state.wireframe.homeMenu;
export const retrieveHomeCategory = (state: ReduxState): Categories =>
  state.wireframe.homeCategory;
export const retrieveHomeChat = (state: ReduxState) => state.wireframe.homeChat;

// serve the reducers for the store configuration in "../store.ts"
export default wireframeSlice.reducer;
