import {
  CONNECT_DB_FAIL,
  CONNECT_DB_REQUEST,
  CONNECT_DB_SUCCESS,
  DISCONNECT_DB_FAIL,
  DISCONNECT_DB_REQUEST,
  DISCONNECT_DB_SUCCESS,
  QUERY_SUGGESTION_FAIL,
  QUERY_SUGGESTION_REQUEST,
  QUERY_SUGGESTION_SUCCESS,
  SYSTEM_QUERY_FAIL,
  SYSTEM_QUERY_REQUEST,
  SYSTEM_QUERY_SUCCESS,
  USER_QUERY_FAIL,
  USER_QUERY_REQUEST,
  USER_QUERY_SUCCESS,
  SET_CONNECTION_ID,
  SET_CURRENT_DB,
  RESET_DB_CONNECTION,
} from "../constants/DBConstants";

export const dbConnectReducer = (state = {}, action) => {
  switch (action.type) {
    case CONNECT_DB_REQUEST:
      return { loading: true };

    case CONNECT_DB_SUCCESS:
      return { loading: false, dbConn: action.payload };

    case CONNECT_DB_FAIL:
      return { loading: false, error: action.payload };

    case RESET_DB_CONNECTION:
      return {};
    default:
      return state;
  }
};

export const dbDisConnectReducer = (state = {}, action) => {
  switch (action.type) {
    case DISCONNECT_DB_REQUEST:
      return { loading: true };

    case DISCONNECT_DB_SUCCESS:
      return { loading: false, dbConn: action.payload };

    case DISCONNECT_DB_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const connectionReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_CONNECTION_ID:
      return {
        ...state,
        connId: action.payload,
      };
    default:
      return state;
  }
};

export const currentDbReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_CURRENT_DB:
      return {
        ...state,
        connId: action.payload,
      };
    default:
      return state;
  }
};
export const generateQueryReducer = (state = {}, action) => {
  switch (action.type) {
    case QUERY_SUGGESTION_REQUEST:
      return { loading: true };

    case QUERY_SUGGESTION_SUCCESS:
      return { loading: false, sqlQuery: action.payload };

    case QUERY_SUGGESTION_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

const initialState = {
  systemQuery: {
    loading: false,
    data: null,
    error: null,
  },
  userQuery: {
    loading: false,
    data: null,
    error: null,
  },
  dbConn: {
    loading: false,
    dbConn: null,
    error: null,
  },
};

export const queryRunReducer = (state = initialState, action) => {
  switch (action.type) {
    case SYSTEM_QUERY_REQUEST:
      return {
        ...state,
        systemQuery: {
          ...state.systemQuery,
          loading: true,
        },
      };
    case SYSTEM_QUERY_SUCCESS:
      return {
        ...state,
        systemQuery: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case SYSTEM_QUERY_FAIL:
      return {
        ...state,
        systemQuery: {
          loading: false,
          data: null,
          error: action.payload,
        },
      };

    case USER_QUERY_REQUEST:
      return {
        ...state,
        userQuery: {
          ...state.userQuery,
          loading: true,
        },
      };
    case USER_QUERY_SUCCESS:
      return {
        ...state,
        userQuery: {
          loading: false,
          data: action.payload,
          error: null,
        },
      };
    case USER_QUERY_FAIL:
      return {
        ...state,
        userQuery: {
          loading: false,
          data: null,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};
