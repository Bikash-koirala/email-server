import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

import profileReducer from "./users";
import emailReducer from "./email"
import appModeReducer from "./appMode";
import multiTaskReducer from "./multitask";
import ribbonActionReducer from "./ribbon";


const reducers = combineReducers({
    profile: profileReducer,
    email: emailReducer,
    appMode: appModeReducer,
    multiTask: multiTaskReducer,
    ribbonAction: ribbonActionReducer 
 });

 const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['appMode']
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
});

export default store;
export const persistor = persistStore(store)

