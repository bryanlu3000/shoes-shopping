import { configureStore } from "@reduxjs/toolkit";
import shopReducer from "./ShopSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Save the redux store states to localstorage
const persistConfig = {
  key: "shopping",
  storage,
  whitelist: ["cartItems"], // Only save cartItems state to localstorage
};

const persistedReducer = persistReducer(persistConfig, shopReducer);

export const store = configureStore({
  reducer: {
    shop: persistedReducer,
  },
  // For non-serializable data
  // If using Redux-Persist, you should specifically ignore all the action types it dispatches:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
