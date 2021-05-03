import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function authReducer(state = initialState.auth, action) {
  switch (action.type) {
    case types.USER_LOGIN_SUCCESS:
      return { ...state, user: action.user }
    case types.USER_SESSION_VALID:
      return { ...state, ...action.sessionDetails }
    case types.USER_LOGOUT:
      return { ...state, ...action.auth }
    case types.USER_SESSION_INVALID:
      return { ...state, session: {}, isAuthenticated: false }
    default:
      return state;
  }
}
