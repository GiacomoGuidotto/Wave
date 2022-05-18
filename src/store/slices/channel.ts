import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxState } from "store/store";

// channel slice type
export interface channelState {
  connected: boolean;
  valid: boolean;
}

// channel slice initial state
const initialState: channelState = {
  connected: false,
  valid: false,
};

// redux store partition ("slice") for the WebSocket channel management
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

export const { updateConnectedStatus, updateValidStatus, updateState } =
  channelSlice.actions;

export const retrieveConnectedStatus = (state: ReduxState) =>
  state.channel.connected;
export const retrieveValidStatus = (state: ReduxState) => state.channel.valid;

// serve the reducers for the store configuration in "../store.ts"
export default channelSlice.reducer;
