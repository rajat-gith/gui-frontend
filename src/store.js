import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { loginUserReducer, registerUserReducer } from "./reducers/AuthReducer";
import { dbConnectReducer, queryRunReducer } from "./reducers/DBReducer";

const reducer = combineReducers({
  userLogin: loginUserReducer,
  userRegister: registerUserReducer,
  connectDb: dbConnectReducer,
  queryRun: queryRunReducer,
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

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
