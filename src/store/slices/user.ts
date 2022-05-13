import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ReduxState } from "../store";

// user slice type
export interface userState {
  token: string;
  username: string;
  name: string;
  surname: string;
  picture: string; // TODO forward study
  phone: string;
  theme: string;
  language: string;
}

// user slice initial state
const initialState: userState = {
  token: "",
  username: "",
  name: "",
  surname: "",
  picture: "",
  phone: "",
  theme: "D",
  language: "EN",
};

// redux store partition ("slice") for the user information management
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.surname = action.payload;
    },
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateSurname: (state, action: PayloadAction<string>) => {
      state.surname = action.payload;
    },
    updatePicture: (state, action: PayloadAction<string>) => {
      state.picture = action.payload;
    },
    updatePhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    updateTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    // test
    updateState: (state, action: PayloadAction<userState>) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.surname = action.payload.surname;
      state.picture = action.payload.picture;
      state.phone = action.payload.phone;
      state.theme = action.payload.theme;
      state.language = action.payload.language;
    },
  },

  // reducer called after server side rendering,
  // used by the wrapper for pass the state from next server to next client
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.user,
      };
    },
  },
});

// user slice reducers
export const {
  updateToken,
  updateUsername,
  updateName,
  updateSurname,
  updatePicture,
  updatePhone,
  updateTheme,
  updateLanguage,
  updateState,
} = userSlice.actions;

// user slice selectors, for the extract of the single element in the user state
export const retrieveToken = (state: ReduxState) => state.user.token;
export const retrieveUsername = (state: ReduxState) => state.user.username;
export const retrieveName = (state: ReduxState) => state.user.name;
export const retrieveSurname = (state: ReduxState) => state.user.surname;
export const retrievePicture = (state: ReduxState) => state.user.picture;
export const retrievePhone = (state: ReduxState) => state.user.phone;
export const retrieveTheme = (state: ReduxState) => state.user.theme;
export const retrieveLanguage = (state: ReduxState) => state.user.language;
export const retrieveState = (state: ReduxState) => state.user;

// serve the reducers for the store configuration in "../store.ts"
export default userSlice.reducer;
