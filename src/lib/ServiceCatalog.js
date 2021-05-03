import UUID from 'uuid/v4';
import AWS from 'aws-sdk';
import ServiceCatalog from "aws-sdk/clients/servicecatalog";
import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import STS from "aws-sdk/clients/sts";
import { Auth } from "aws-amplify";
import { isEmpty } from '../helpers/utils';

AWS.config.update({ region: 'us-west-2' });
AWS.config.apiVersions = {
  servicecatalog: '2015-12-10',
  iam: '2010-05-08',
};

const searchProducts = async (_selectedProject = {}, region = 'us-west-2', params = {}) => {
  const serviceCatalog = await _serviceCatalogBuilder(region);
  if (!_selectedProject) {
    return {};
  }
  const productsCatalogsList = await _getAllPaginatedResults(serviceCatalog.searchProducts.bind(serviceCatalog), params, "PageToken", "ProductViewSummaries");
  const _productsCatalog = await Promise.all(productsCatalogsList.map(async (catalogProduct) => {
    const _allProductPortfolios = await _getAllPaginatedResults(serviceCatalog.listPortfoliosForProduct.bind(serviceCatalog), { ProductId: catalogProduct.ProductId }, "PageToken", "PortfolioDetails");
    const _productPortfolios = _allProductPortfolios.filter(_productPortfolio => _productPortfolio.Id === _selectedProject.Id);

    if (_productPortfolios.length > 0) {
      const _productDetails = await serviceCatalog.describeProductAsAdmin({ Id: catalogProduct.ProductId }).promise();
      const _productLaunchPaths = await serviceCatalog.listLaunchPaths({ ProductId: catalogProduct.ProductId }).promise();
      const _provisioningParameters = await serviceCatalog.describeProvisioningParameters({
        ProductId: catalogProduct.ProductId,
        ProvisioningArtifactId: _productDetails.ProvisioningArtifactSummaries[0].Id,
        PathId: _productLaunchPaths.LaunchPathSummaries[0].Id
      }).promise();

      const product = {
        product: _productDetails.ProductViewDetail,
        artifact: _productDetails.ProvisioningArtifactSummaries[0],
        tags: _productDetails.Tags,
        tagOptions: _productDetails.TagOptions,
        launchPath: _productLaunchPaths.LaunchPathSummaries[0],
        provisioningParameters: _provisioningParameters.ProvisioningArtifactParameters,
        productPortfolio: _productPortfolios[0]
      }
      return product;
    }
  }));
  const productsCatalog = _productsCatalog.filter(catalogProduct => !isEmpty(catalogProduct));
  return productsCatalog;
};


const _hasAccessToPortfolio = async (serviceCatalog, userRoleArns, project) => {
  const _portfolioPrincipals = await serviceCatalog.listPrincipalsForPortfolio({ PortfolioId: project.PortfolioDetail.Id }).promise();
  const portfolioPrincipalsArns = await _portfolioPrincipals.Principals
    .filter(principal => principal.PrincipalType === "IAM" && userRoleArns.includes(principal.PrincipalARN));
  console.log("ServiceCatalog >> _hasAccessToPortfolio >> portfolioPrincipalsArns", portfolioPrincipalsArns);
  if (portfolioPrincipalsArns.length >= 1)
    return true
  return false;
}

const asyncFilter = async (arr, callback) => {
  const fail = Symbol()
  return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}


const listPortfolios = async (region = 'us-west-2') => {
  const _userRoleData = await _listGroupsForUser();
  if (isEmpty(_userRoleData) || isEmpty(_userRoleData.Groups) || _userRoleData.Groups.length < 1) {
    return [];
  }
  const userRoleArns = _userRoleData.Groups.map(_group => _group.RoleArn);
  //console.log("ServiceCatalog >> listPortfolios >> userRoleArns", userRoleArns);
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const params = { AcceptLanguage: 'en' };
  const projectList = await _getAllPaginatedResults(serviceCatalog.listPortfolios.bind(serviceCatalog), params, "PageToken", "PortfolioDetails");
  const projectListWithTags = await Promise.all(projectList.map(async item => {
    return await serviceCatalog.describePortfolio({ "AcceptLanguage": "en", "Id": item.Id }).promise();
  }));

  return await asyncFilter(projectListWithTags, async project => {
    console.log("ServiceCatalog >> listPortfolios >> project", project);
    return await _hasAccessToPortfolio(serviceCatalog, userRoleArns, project);
  });
}



const provisionProduct = async (provisionRequest, region = 'us-west-2') => {
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const userTag = [{ "Key": "UserId", "Value": provisionRequest.User.id }, { "Key": "UserName", "Value": provisionRequest.User.username }];
  const projectTag = [
    { "Key": "ProjectId", "Value": provisionRequest.SelectedProject.Id },
    { "Key": "ProjectARN", "Value": provisionRequest.SelectedProject.ARN },
    { "Key": "ProjectDisplayName", "Value": provisionRequest.SelectedProject.DisplayName }
  ];

  return await serviceCatalog.provisionProduct({
    ProductId: provisionRequest.ProductId,
    ProvisionToken: UUID(),
    ProvisionedProductName: provisionRequest.ResourceName,
    ProvisioningArtifactId: provisionRequest.ProvisioningArtifactId,
    PathId: provisionRequest.PathId,
    Tags: [...provisionRequest.Tags, ...userTag, ...projectTag],
    ProvisioningParameters: provisionRequest.ProvisioningParams,
  }).promise();
};

const searchProvisionedProducts = async (accessLevelFilterKey = 'Account', region = 'us-west-2') => {
  let params = {
    AccessLevelFilter: { Key: accessLevelFilterKey, Value: "self" },
    SortBy: 'createdTime',
    SortOrder: 'DESCENDING'
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const provisionedProducts = await _getAllPaginatedResults(serviceCatalog.searchProvisionedProducts.bind(serviceCatalog), params, "PageToken", "ProvisionedProducts");
  return provisionedProducts;
};

const describeProvisionedProduct = async (provisionedProductId, region = 'us-west-2') => {
  let params = {
    Id: provisionedProductId,
    AcceptLanguage: 'en'
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const provisionedProductDetails = await serviceCatalog.describeProvisionedProduct(params).promise();
  return provisionedProductDetails;
}


const describeProductView = async (productViewId, region = 'us-west-2') => {
  let params = {
    Id: productViewId,
    AcceptLanguage: 'en'
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const productView = await serviceCatalog.describeProductView(params).promise();
  return productView;
}


const describeProduct = async (productId, region = 'us-west-2') => {
  let params = {
    Id: productId,
    AcceptLanguage: 'en'
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const provisionedProductView = await serviceCatalog.describeProduct(params).promise();
  return provisionedProductView;
}




const listBudgetsForResource = async (resourceId, region = 'us-west-2') => {
  let params = {
    ResourceId: resourceId,
    AcceptLanguage: 'en',
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const _budgetsList = await _getAllPaginatedResults(serviceCatalog.listBudgetsForResource.bind(serviceCatalog), params, "PageToken", "Budgets");
  return _budgetsList;
}


const listServiceActionsForProvisioningArtifact = async (productId, provisioningArtifactId, region = 'us-west-2') => {
  let params = {
    ProductId: productId,
    ProvisioningArtifactId: provisioningArtifactId,
    AcceptLanguage: 'en',
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const _serviceActions = await _getAllPaginatedResults(serviceCatalog.listServiceActionsForProvisioningArtifact.bind(serviceCatalog), params, "PageToken", "ServiceActionSummaries");
  return _serviceActions;
}


const executeProvisionedProductServiceAction = async (provisionedProductId, serviceActionId, region = 'us-west-2') => {
  let params = {
    ProvisionedProductId: provisionedProductId,
    ServiceActionId: serviceActionId,
    ExecuteToken: UUID(),
    AcceptLanguage: 'en',
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const _serviceActions = await serviceCatalog.executeProvisionedProductServiceAction(params).promise();
  return _serviceActions;
}




const listStackInstancesForProvisionedProduct = async (provisionedProductId, region = 'us-west-2') => {
  let params = {
    ProvisionedProductId: provisionedProductId,
    AcceptLanguage: 'en'
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const stackInstances = await _getAllPaginatedResults(serviceCatalog.listStackInstancesForProvisionedProduct.bind(serviceCatalog), params, "PageToken", "StackInstances");
  return stackInstances;
}


const describeRecordForProvisionedProduct = async (provisionedProductId, region = 'us-west-2') => {
  let params = {
    Id: provisionedProductId,
    AcceptLanguage: 'en'
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const stackInstances = await _getAllPaginatedResults(serviceCatalog.describeRecord.bind(serviceCatalog), params, "PageToken", "StackInstances");
  return stackInstances;
}


const listRecordHistory = async (provisionedProductId, region = 'us-west-2') => {
  let params = {
    AcceptLanguage: 'en',
    AccessLevelFilter: {
      Key: 'Account',
      Value: 'self'
    },
    SearchFilter: {
      Key: 'provisionedproduct',
      Value: provisionedProductId
    }
  };
  const serviceCatalog = await _serviceCatalogBuilder(region);
  const _recordHistory = await serviceCatalog.listRecordHistory(params).promise();
  let _recordHistoryWithDetails = [];
  if (!isEmpty(_recordHistory.RecordDetails) && _recordHistory.RecordDetails.length > 0) {
    _recordHistoryWithDetails = _recordHistory.RecordDetails = _recordHistory.RecordDetails.map(record => {
      return describeRecordDetails(record.RecordId, serviceCatalog);
    });
    return Promise.all(_recordHistoryWithDetails);
  }
  return [];
}

const describeRecordDetails = async (recordId, serviceCatalog) => {
  // const serviceCatalog = await _serviceCatalogBuilder(region);
  return await serviceCatalog.describeRecord({ Id: recordId }).promise();
};


const terminateProvisionedProduct = async (provisionedProductId, region = 'us-west-2') => {
  var params = {
    TerminateToken: UUID(),
    AcceptLanguage: 'en',
    IgnoreErrors: true,
    ProvisionedProductId: provisionedProductId,
  }
  const serviceCatalog = await _serviceCatalogBuilder(region);
  return await serviceCatalog.terminateProvisionedProduct(params).promise();
};


const _getAllPaginatedResults = async (fn, params, nextTokenAttrName, resourceArrName, portfolios = []) => {
  return fn(params).promise()
    .then(function (data) {
      portfolios.push(...data[resourceArrName]);
      if (data[nextTokenAttrName]) {
        params[nextTokenAttrName] = data[nextTokenAttrName];
        return _getAllPaginatedResults(fn, params, resourceArrName, []);
      } else {
        return portfolios;
      }
    });
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

const _serviceCatalogBuilder = async (region) => {
  // let awsRegion = !region ? 'us-west-2' : region;
  const _roleData = await _listGroupsForUser();
  if (isEmpty(_roleData) || isEmpty(_roleData.Groups) || _roleData.Groups.length < 1) {
    throw new Error("User dont have access to any project");
  }
  const accessparams = await _getCrossAccountCredentials(_roleData.Groups[0].RoleArn)
  return new ServiceCatalog(accessparams);

}


export default {
  listPortfolios,
  searchProducts,
  describeProduct,
  describeProductView,
  listStackInstancesForProvisionedProduct,
  describeProvisionedProduct,
  describeRecordForProvisionedProduct,
  provisionProduct,
  searchProvisionedProducts,
  listRecordHistory,
  listBudgetsForResource,
  listServiceActionsForProvisioningArtifact,
  executeProvisionedProductServiceAction,
  describeRecordDetails,
  terminateProvisionedProduct
};
