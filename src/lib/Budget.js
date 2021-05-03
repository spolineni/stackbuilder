import AWS from 'aws-sdk';
import Budgets from "aws-sdk/clients/budgets";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import STS from "aws-sdk/clients/sts";
import { Auth } from "aws-amplify";
import { isEmpty } from '../helpers/utils';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: 'us-west-2' });
AWS.config.apiVersions = {
  budgets: '2016-10-20',
};

const _listGroupsForUser = async () => {
  const _currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
  const _currentUserCredentials = await Auth.currentUserCredentials();
  AWS.config.credentials = _currentUserCredentials;
  const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider()
  var params = {
    UserPoolId: 'us-west-2_cfzKSDvNl', /* required */
    Username: _currentAuthenticatedUser.username, /* required */
  };
  const _roleData = await cognitoidentityserviceprovider.adminListGroupsForUser(params).promise();
  return _roleData
}

const _getCrossAccountCredentials = async (assumedRoleArn) => {
  return new Promise((resolve, reject) => {
    const timestamp = (new Date()).getTime();
    const params = {
      RoleArn: assumedRoleArn,
      RoleSessionName: `APIAssumedRole-${timestamp}`
    };
    const sts = new STS();
    sts.assumeRole(params, (err, data) => {
      if (err) reject(err);
      else {
        resolve({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken,
        });
      }
    });
  });
}

const _budgetBuilder = async (region) => {
  const _roleData = await _listGroupsForUser();
  if (isEmpty(_roleData) || isEmpty(_roleData.Groups) || _roleData.Groups.length < 1) {
    throw new Error("User dont have access to any project");
  }
  const accessparams = await _getCrossAccountCredentials(_roleData.Groups[0].RoleArn);
  return new Budgets(accessparams);
}

const describeBudget = async (_budgetName, region = 'us-west-2') => {
  let params = {
    AccountId: "869605106696",
    BudgetName: _budgetName
  };
  const budget = await _budgetBuilder(region);
  const budgetDetails = await budget.describeBudget(params).promise();
  return budgetDetails;
}


export default {
  describeBudget
};
