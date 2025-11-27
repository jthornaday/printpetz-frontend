import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import sessionUserReducer from "./slices/sessionUserSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from "redux-persist";

import { supabaseBaseApi, serverBaseApi, supabaseAuthApi } from "./api/baseApi";
import storage from "redux-persist/es/storage";

const rootReducer = combineReducers({
  sessionUser: sessionUserReducer,
  [supabaseBaseApi.reducerPath]: supabaseBaseApi.reducer,
  [serverBaseApi.reducerPath]: serverBaseApi.reducer,
  [supabaseAuthApi.reducerPath]: supabaseAuthApi.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  blacklist: [serverBaseApi.reducerPath, supabaseAuthApi.reducerPath, supabaseBaseApi.reducerPath], // do not persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(supabaseBaseApi.middleware)
      .concat(serverBaseApi.middleware)
      .concat(supabaseAuthApi.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
