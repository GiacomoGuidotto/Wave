import {createWrapper} from "next-redux-wrapper";
import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import userReducer from "./slices/user";

// Global Redux store types
export type ReduxStore = ReturnType<typeof makeStore>

export type ReduxState = ReturnType<ReduxStore["getState"]>

export type ReduxDispatch = ReturnType<ReduxStore["dispatch"]>

export type ReduxThunk<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, Action>

// Redux store instance constructor
const makeStore = () => configureStore({
  reducer: {
    user: userReducer
  },
  devTools: true
})

// Next Redux wrapper creation
const wrapper = createWrapper<ReduxStore>(makeStore);

export default wrapper;
