import {
  CONNECT_DB_SUCCESS,
  CONNECT_DB_FAIL,
  CONNECT_DB_REQUEST,
  QUERRY_RUN_REQUEST,
  QUERRY_RUN_SUCCESS,
  QUERRY_RUN_FAIL,
} from "../constants/DBConstants";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const connectDb = (connectDbCreds) => async (dispatch) => {
  try {
    const { dbType, host, port, user, password } = connectDbCreds;
    console.log(dbType, host, port, user, password);
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
      },
      config
    );

    dispatch({
      type: CONNECT_DB_SUCCESS,
      payload: { data },
    });

    localStorage.setItem("isDbConnected", JSON.stringify(true));
  } catch (error) {
    dispatch({
      type: CONNECT_DB_FAIL,
      payload: error.response,
    });
  }
};

export const queryRun = (query) => async (dispatch) => {
  try {
    dispatch({
      type: QUERRY_RUN_REQUEST,
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
      type: QUERRY_RUN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: QUERRY_RUN_FAIL,
      payload: error.response,
    });
  }
};
