import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
// import {
//   removeCartOnLogout,
// } from "../actions/cart";



//staff is deprecated but i'm leaving it because it'll eventually be replaced with "role" or "privs" or something to insight role based authentication
const initialState = {
  token: null,
  error: null,
  loading: false,
  username: null ,
  user_id: 0 ,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};


const authSuccess = (state, action) => {

  return updateObject(state, {
    token: action.token ,
    username: action.username ,
    user_id: action.user_id ,
    success_message : action.success_message ,
    error: null ,
    loading: false ,

  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    success_message : null ,
    error: action.error,
    loading: false
  });
};

const authLogout = (state, action) => {

  return updateObject(state, {
    token : null ,
    user_id : 0 ,

  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
