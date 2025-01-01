import {
  CONNECT_DB_SUCCESS,
  CONNECT_DB_FAIL,
  CONNECT_DB_REQUEST,
  SYSTEM_QUERY_FAIL,
  SYSTEM_QUERY_REQUEST,
  SYSTEM_QUERY_SUCCESS,
  USER_QUERY_FAIL,
  USER_QUERY_REQUEST,
  USER_QUERY_SUCCESS,
  DISCONNECT_DB_REQUEST,
  DISCONNECT_DB_SUCCESS,
  DISCONNECT_DB_FAIL,
  QUERY_SUGGESTION_FAIL,
  QUERY_SUGGESTION_SUCCESS,
  QUERY_SUGGESTION_REQUEST,
} from "../constants/DBConstants";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const connectDb = (connectDbCreds) => async (dispatch) => {
  try {
    const { dbType, host, port, user, password, database } = connectDbCreds;
    dispatch({
      type: CONNECT_DB_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${BASE_URL}/api/connect`,
      {
        dbType: dbType,
        host: host,
        port: port,
        user: user,
        password: password,
        database: database,
      },
      config
    );

    dispatch({
      type: CONNECT_DB_SUCCESS,
      payload: { data },
    });
    localStorage.setItem("threadId",data.data.split(' ').slice(-1)[0])
    localStorage.setItem("isDbConnected", (true));
  } catch (error) {
    dispatch({
      type: CONNECT_DB_FAIL,
      payload: error.response,
    });
  }
};

export const disconnectDb = () => async (dispatch) => {
  try {
    dispatch({
      type: DISCONNECT_DB_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(`${BASE_URL}/api/disconnect`, {}, config);

    dispatch({
      type: DISCONNECT_DB_SUCCESS,
      payload: { data },
    });

    localStorage.setItem("isDbConnected", JSON.stringify(false));
  } catch (error) {
    dispatch({
      type: DISCONNECT_DB_FAIL,
      payload: error.response,
    });
  }
};

export const queryRun =
  (query, queryType = "user", callback = null) =>
  async (dispatch) => {
    const isSystemQuery =
      query.toLowerCase().includes("show databases") ||
      query.toLowerCase().includes("show tables") ||
      query.toLowerCase().includes("describe");

    try {
      dispatch({
        type: isSystemQuery ? SYSTEM_QUERY_REQUEST : USER_QUERY_REQUEST,
      });

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${BASE_URL}/api/query`,
        {
          query: query,
        },
        config
      );

      dispatch({
        type: isSystemQuery ? SYSTEM_QUERY_SUCCESS : USER_QUERY_SUCCESS,
        payload: data,
      });

      if (callback) {
        callback(data);
      }
    } catch (error) {
      dispatch({
        type: isSystemQuery ? SYSTEM_QUERY_FAIL : USER_QUERY_FAIL,
        payload: error.response,
      });
    }
  };

export const generateQueryAction =
  (naturalQuery, tableName, callback = null) =>
  async (dispatch) => {
    try {
      dispatch({
        type: QUERY_SUGGESTION_REQUEST,
      });

      const { data } = await axios.post(`${BASE_URL}/api/generate-query`, {
        naturalQuery,
        tableName,
      });

      if (!data.query) {
        throw new Error("Failed to generate SQL query");
      }

      dispatch({
        type: QUERY_SUGGESTION_SUCCESS,
        payload: data.query,
      });

      if (callback) {
        callback(data.query);
      }
    } catch (error) {
      dispatch({
        type: QUERY_SUGGESTION_FAIL,
        payload: error.response ? error.response.data : error.message,
      });
    }
  };
