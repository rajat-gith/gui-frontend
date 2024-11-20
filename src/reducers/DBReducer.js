import {
  CONNECT_DB_FAIL,
  CONNECT_DB_REQUEST,
  CONNECT_DB_SUCCESS,
  QUERRY_RUN_FAIL,
  QUERRY_RUN_REQUEST,
  QUERRY_RUN_SUCCESS,
} from "../constants/DBConstants";

export const dbConnectReducer = (state = {}, action) => {
  switch (action.type) {
    case CONNECT_DB_REQUEST:
      return { loading: true };

    case CONNECT_DB_SUCCESS:
      return { loading: false, dbConn: action.payload };

    case CONNECT_DB_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

const initialState = {
  systemQueryResult: null,
  userQueryResult: null,
  loading: false,
  error: null,
};

export const queryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "QUERY_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "QUERY_SUCCESS":
      // Check if this is a system query (database/tables) or user query
      if (
        action.payload.data[0] &&
        (Object.keys(action.payload.data[0])[0] === "Database" ||
          Object.keys(action.payload.data[0])[0].split("_")[0] === "Tables")
      ) {
        return {
          ...state,
          systemQueryResult: action.payload,
          loading: false,
        };
      } else {
        return {
          ...state,
          userQueryResult: action.payload,
          loading: false,
        };
      }
    case "QUERY_FAILURE":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "CLEAR_QUERIES":
      return initialState;
    default:
      return state;
  }
};
