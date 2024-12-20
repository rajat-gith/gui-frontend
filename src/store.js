import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { loginUserReducer, registerUserReducer } from "./reducers/AuthReducer";
import {
  dbConnectReducer,
  queryRunReducer,
  dbDisConnectReducer,
} from "./reducers/DBReducer";

const reducer = combineReducers({
  userLogin: loginUserReducer,
  userRegister: registerUserReducer,
  connectDb: dbConnectReducer,
  queryRun: queryRunReducer,
  disconnectDb: dbDisConnectReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const dbInfoFromStorage = localStorage.getItem("isDbConnected")
  ? JSON.parse(localStorage.getItem("isDbConnected"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  userRegister: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
