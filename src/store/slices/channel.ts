import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxState } from "store/store";

// wireframe slice type
export interface channelState {
  connected: boolean;
  valid: boolean;
}

// user slice initial state
const initialState: channelState = {
  connected: false,
  valid: false,
};

// redux store partition ("slice") for the wireframe state management
export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    updateConnectedStatus: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    updateValidStatus: (state, action: PayloadAction<boolean>) => {
      state.valid = action.payload;
    },
    updateState: (state, action: PayloadAction<channelState>) => {
      state.connected = action.payload.connected;
      state.valid = action.payload.valid;
    },
  },
});

// user slice reducers
export const { updateConnectedStatus, updateValidStatus, updateState } =
  channelSlice.actions;

// user slice selectors, for the extract of the single element in the user state
export const retrieveConnectedStatus = (state: ReduxState) =>
  state.channel.connected;
export const retrieveValidStatus = (state: ReduxState) => state.channel.valid;

// serve the reducers for the store configuration in "../store.ts"
export default channelSlice.reducer;
