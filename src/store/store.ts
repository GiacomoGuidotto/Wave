import { createWrapper } from "next-redux-wrapper";
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import userReducer from "store/slices/user";
import wireframeReducer from "store/slices/wireframe";
import channelReducer from "store/slices/channel";
import storage from "redux-persist/lib/storage/session";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

// Global Redux store types
export type ReduxStore = ReturnType<typeof makeStore>;

export type ReduxState = ReturnType<ReduxStore["getState"]>;

export type ReduxDispatch = ReturnType<ReduxStore["dispatch"]>;

export type ReduxThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;

// Redux reducer composition
const reducers = combineReducers({
  user: userReducer,
  wireframe: wireframeReducer,
  channel: channelReducer,
});

// Redux persisted storage configuration
const persistConfig = {
  timeout: 1,
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

// Redux store instance constructor
export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const makeStore = () => {
  return store;
};

// Next Redux wrapper creation
const wrapper = createWrapper<ReduxStore>(makeStore);

export default wrapper;
