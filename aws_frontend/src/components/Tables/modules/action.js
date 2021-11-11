import * as actionTypes from "./constant";
import axios from "axios";

export const actGetTable = () => {
  const accessToken = localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : "";
    
  return (dispatch) => {
    dispatch(actGetTableRequest());
    axios({
      url: `https://k9ilwv1dvj.execute-api.us-east-1.amazonaws.com/cloudbe/tables?limit=10`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
      },
    })
      .then((result) => {
        dispatch(actGetTableSuccess(result.data));
      })
      .catch((error) => {
        dispatch(actGetTableFailed(error));
      });
  };
};

const actGetTableRequest = () => {
  return {
    type: actionTypes.GET_TABLE_REQUEST,
  };
};

const actGetTableSuccess = (payload) => {
  return {
    type: actionTypes.GET_TABLE_SUCCESS,
    payload,
  };
};

const actGetTableFailed = (error) => {
  return {
    type: actionTypes.GET_TABLE_FAILED,
    payload: error,
  };
};
