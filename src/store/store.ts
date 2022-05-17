import { createWrapper } from "next-redux-wrapper";
import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import userReducer from "store/slices/user";
import wireframeReducer from "store/slices/wireframe";
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

// export type PersistentEnhancedStore = EnhancedStore & {
//   persistor?: Persistor;
// };

// Redux reducer composition
const reducers = combineReducers({
  user: userReducer,
  wireframe: wireframeReducer,
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
const store = configureStore({
  reducer:    persistedReducer,
  devTools:   true,
  middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                  serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
                  }
                })
});

// Redux persisted storage initialization
// store.persistor = persistStore(store);

const makeStore = () => {
  return store;
};
// Next Redux wrapper creation
const wrapper = createWrapper<ReduxStore>(makeStore);

export default wrapper;
