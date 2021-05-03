import AWS from 'aws-sdk';
import { Auth } from "aws-amplify";
AWS.config.update({ region: 'us-west-2' });

const isAuthenticated = () => {
  let _isAuthenticated = false;
  Auth.currentUserInfo().then(_currentUserInfo => {
    return true;
  });
  return _isAuthenticated;
}

export default {
  isAuthenticated
};
