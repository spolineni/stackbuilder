import * as types from "./actionTypes";
import { Auth } from "aws-amplify";
import history from '../../helpers/history';


export const userSessionLoad = () => {
  return async dispatch => {
    try {
      let _session = await Auth.currentSession();
      let _currentUserInfoRaw = await Auth.currentUserInfo();
      const _currentUserInfo = { username: _currentUserInfoRaw.username, email: _currentUserInfoRaw.attributes.email }
      // console.log("userSessionLoad >> ", _currentUserInfo.attributes.email);
      let _isAuthenticated = false
      if (Object.keys(_currentUserInfo).length !== 0 || _currentUserInfo.constructor !== Object)
        _isAuthenticated = true;

      const sessionDetails = {
        session: _session,
        user: _currentUserInfo,
        isAuthenticated: _isAuthenticated,
      }
      // console.log("AuthAction >> userSessionLoad >> sessionDetails >>", sessionDetails)
      localStorage.setItem('isAuthenticated', _isAuthenticated);
      if (_isAuthenticated) {
        dispatch({ type: types.USER_SESSION_VALID, sessionDetails });
      }
      else {
        dispatch({ type: types.USER_SESSION_INVALID });
      }
    } catch (error) {
      dispatch({ type: types.USER_SESSION_INVALID });
    }
  }
};


export const login = (username, password) => {
  return async dispatch => {
    await Auth.signIn(username, password);
    let _session = await Auth.currentSession();
    let _currentUserInfo = await Auth.currentUserInfo();
    let _isAuthenticated = false
    if (_currentUserInfo && _currentUserInfo.id)
      _isAuthenticated = true;
    const sessionDetails = {
      session: _session,
      user: _currentUserInfo,
      isAuthenticated: _isAuthenticated,
    }
    localStorage.setItem('isAuthenticated', _isAuthenticated);
    dispatch({ type: types.USER_SESSION_VALID, sessionDetails });
    history.push('/');
  }
};


export const logout = () => {
  //const _user = await Auth.signIn(username, password);
  return async dispatch => {
    const auth = {
      session: {},
      user: {},
      isAuthenticated: false
    };
    localStorage.setItem('isAuthenticated', false);
    await Auth.signOut();
    localStorage.removeItem('selectedProject');
    // console.log("AuthAction >> logout >>> userSignOut", userSignOut)
    dispatch({ type: types.USER_LOGOUT, auth });
    history.push('/login');
  }
};

export const sessionRefresh = user => ({
  type: types.CREATE_TOKEN_REFRESH,
  user
});
